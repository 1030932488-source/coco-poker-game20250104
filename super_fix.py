import json
import os

PREFAB_PATH = r'd:\coco_poker\assets\prefabs\Card.prefab'
SCENE_PATH = r'd:\coco_poker\assets\scenes\GameScene.scene'
LEVEL_PATH = r'd:\coco_poker\assets\resources\configs\level1.json'

UI_LAYER = 33554432 # UI_2D (标准 Cocos UI 层级)

def fix_prefab():
    print("Fixing Card Prefab...")
    if not os.path.exists(PREFAB_PATH):
        print(f"Error: {PREFAB_PATH} not found")
        return
    
    with open(PREFAB_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for item in data:
        if not isinstance(item, dict): continue
        if item.get('__type__') == 'cc.Node':
            item['_layer'] = UI_LAYER # 设置为 UI_2D 层级
        elif item.get('__type__') == 'cc.UITransform':
            # 统一设为 100x140 (标准扑克比例)
            item['_contentSize'] = {"__type__": "cc.Size", "width": 100, "height": 140}
    
    with open(PREFAB_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def fix_scene():
    print("Fixing Game Scene...")
    if not os.path.exists(SCENE_PATH):
        print(f"Error: {SCENE_PATH} not found")
        return
        
    with open(SCENE_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for item in data:
        if not isinstance(item, dict): continue
        
        # 节点属性
        if item.get('__type__') == 'cc.Node':
            name = item.get('_name')
            item['_layer'] = UI_LAYER # 设置所有 UI 节点到 UI_2D
            
            if name == 'PlayfieldArea':
                item['_lpos'] = {"__type__": "cc.Vec3", "x": 0, "y": 150, "z": 0}
            elif name == 'StackArea':
                # 底牌堆放在左下角
                item['_lpos'] = {"__type__": "cc.Vec3", "x": -250, "y": -550, "z": 0}
            elif name == 'BaseCardArea':
                # 废牌区(当前底牌)放在右下角
                item['_lpos'] = {"__type__": "cc.Vec3", "x": 150, "y": -550, "z": 0}
                
        # 相机可见性
        elif item.get('__type__') == 'cc.Camera':
            # 确保相机能看到 UI_2D (33554432)
            # 1855979519 这个掩码包含了大部分标准层级
            item['_visibility'] = 1855979519 

    with open(SCENE_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def fix_level():
    print("Fixing Level Config...")
    if not os.path.exists(LEVEL_PATH):
        print(f"Warning: {LEVEL_PATH} not found, skipping level fix")
        return
        
    # 定义分布更合理的金字塔布局
    # 第一行 1张
    # 第二行 2张 间隔 120
    # 第三行 3张 间隔 120
    # Y 间隔 160 (140卡高 + 20间隙)
    config = {
        "Playfield": [
            {"CardFace": 12, "CardSuit": 0, "Position": {"x": 0, "y": 320}},
            {"CardFace": 2, "CardSuit": 0, "Position": {"x": -60, "y": 160}},
            {"CardFace": 2, "CardSuit": 1, "Position": {"x": 60, "y": 160}},
            {"CardFace": 2, "CardSuit": 0, "Position": {"x": -120, "y": 0}},
            {"CardFace": 2, "CardSuit": 0, "Position": {"x": 0, "y": 0}},
            {"CardFace": 1, "CardSuit": 3, "Position": {"x": 120, "y": 0}}
        ],
        "Stack": [
            {"CardFace": 2, "CardSuit": 0, "Position": {"x": 0, "y": 0}},
            {"CardFace": 0, "CardSuit": 2, "Position": {"x": 0, "y": 0}},
            {"CardFace": 3, "CardSuit": 0, "Position": {"x": 0, "y": 0}}
        ]
    }
    with open(LEVEL_PATH, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=4, ensure_ascii=False)

if __name__ == '__main__':
    fix_prefab()
    fix_scene()
    fix_level()
    print("All structural fixes applied successfully!")
