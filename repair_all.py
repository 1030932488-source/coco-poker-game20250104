import json
import os

PREFAB_PATH = r'd:\coco_poker\assets\prefabs\Card.prefab'
SCENE_PATH = r'd:\coco_poker\assets\scenes\GameScene.scene'
LEVEL_PATH = r'd:\coco_poker\assets\resources\configs\level1.json'

UI_LAYER = 33554432 # UI_2D

def fix_prefab():
    print("Fixing Card Prefab...")
    with open(PREFAB_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for item in data:
        if not isinstance(item, dict): continue
        if item.get('__type__') == 'cc.Node':
            item['_layer'] = UI_LAYER
        elif item.get('__type__') == 'cc.UITransform':
            # 尺寸设为更小的 80x112
            item['_contentSize'] = {"__type__": "cc.Size", "width": 80, "height": 112}
            # 确保锚点存在，防止 anchorX 报错
            item['_anchorPoint'] = {"__type__": "cc.Vec2", "x": 0.5, "y": 0.5}
    
    with open(PREFAB_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def fix_scene():
    print("Fixing Game Scene...")
    with open(SCENE_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 查找 Canvas 节点 ID
    canvas_id = -1
    for i, item in enumerate(data):
        if isinstance(item, dict) and item.get('__type__') == 'cc.Node' and item.get('_name') == 'Canvas':
            canvas_id = i
            break
    
    print(f"Canvas ID found: {canvas_id}")

    for i, item in enumerate(data):
        if not isinstance(item, dict): continue
        
        if item.get('__type__') == 'cc.Node':
            name = item.get('_name')
            item['_layer'] = UI_LAYER
            if name == 'PlayfieldArea':
                item['_lpos'] = {"__type__": "cc.Vec3", "x": 0, "y": 200, "z": 0}
            elif name == 'StackArea':
                item['_lpos'] = {"__type__": "cc.Vec3", "x": -250, "y": -600, "z": 0}
            elif name == 'BaseCardArea':
                item['_lpos'] = {"__type__": "cc.Vec3", "x": 150, "y": -600, "z": 0}
                
        elif item.get('__type__') == 'cc.UITransform':
            node_ref = item.get('node', {}).get('__id__')
            # 如果是 Canvas 节点的 UITransform
            if node_ref == canvas_id:
                print(f"Restoring Canvas UITransform at index {i}")
                item['_contentSize'] = {"__type__": "cc.Size", "width": 1080, "height": 2080}
                item['_anchorPoint'] = {"__type__": "cc.Vec2", "x": 0.5, "y": 0.5}
            else:
                # 其他容器节点也确保锚点存在
                if '_anchorPoint' not in item:
                    item['_anchorPoint'] = {"__type__": "cc.Vec2", "x": 0.5, "y": 0.5}
                # 容器尺寸可以设大一点防止裁剪
                if item.get('_contentSize', {}).get('width') == 100:
                    item['_contentSize'] = {"__type__": "cc.Size", "width": 1000, "height": 1000}

        elif item.get('__type__') == 'cc.Camera':
            item['_visibility'] = 1855979519 

    with open(SCENE_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def fix_level():
    print("Fixing Level Config...")
    # 扩大间距以适应 80x112 卡牌
    # X 间隔 120 (80+40空隙)
    # Y 间隔 140 (112+28空隙)
    config = {
        "Playfield": [
            {"CardFace": 12, "CardSuit": 0, "Position": {"x": 0, "y": 300}, "Comment": "顶层"},
            {"CardFace": 2, "CardSuit": 0, "Position": {"x": -60, "y": 150}, "Comment": "第二行左"},
            {"CardFace": 2, "CardSuit": 1, "Position": {"x": 60, "y": 150}, "Comment": "第二行右"},
            {"CardFace": 2, "CardSuit": 0, "Position": {"x": -120, "y": 0}, "Comment": "第三行左"},
            {"CardFace": 2, "CardSuit": 0, "Position": {"x": 0, "y": 0}, "Comment": "第三行中"},
            {"CardFace": 1, "CardSuit": 3, "Position": {"x": 120, "y": 0}, "Comment": "第三行右"}
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
    print("Repair finished!")
