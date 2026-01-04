import json
import os

SCENE_PATH = r'd:\coco_poker\assets\scenes\GameScene.scene'
PREFAB_PATH = r'd:\coco_poker\assets\prefabs\Card.prefab'
LEVEL_PATH = r'd:\coco_poker\assets\resources\configs\level1.json'

def fix_view():
    print("Applying Final Visual Fixes...")
    
    # 1. 修复场景 (Camera & Area Positions)
    if os.path.exists(SCENE_PATH):
        with open(SCENE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for item in data:
            # 修复 Camera -> 改为 ORTHO (正交投影), 适合 2D UI
            if item.get('__type__') == 'cc.Camera':
                print("Fixing Camera to ORTHO mode...")
                item['_projection'] = 0  # 0 = ORTHO, 1 = PERSPECTIVE
                item['_orthoHeight'] = 1040 # 2080 / 2 = 1040 (适配 Design Height)
                item['_near'] = 1
                item['_far'] = 2000 # 确保覆盖所有 Z 轴内容
                
            # 调整区域位置
            if item.get('__type__') == 'cc.Node':
                name = item.get('_name')
                if name == 'PlayfieldArea':
                    # 主牌区放上面一点
                    item['_lpos'] = {"__type__": "cc.Vec3", "x": 0, "y": 200, "z": 0}
                elif name == 'StackArea':
                    # 底部区域
                    item['_lpos'] = {"__type__": "cc.Vec3", "x": 0, "y": -600, "z": 0} 
                    
        with open(SCENE_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    # 2. 修复卡牌预制体 (Size)
    if os.path.exists(PREFAB_PATH):
        with open(PREFAB_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        for item in data:
            if item.get('__type__') == 'cc.UITransform':
                # 设置为 100x140 (对于 1080p 屏幕比较合适的尺寸)
                print("Resizing Card Prefab to 100x140...")
                item['_contentSize'] = {"__type__": "cc.Size", "width": 100, "height": 140}
                
        with open(PREFAB_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    # 3. 修复关卡配置 (Layout)
    print("Updating Level Layout...")
    config = {
        "Playfield": [
            # 金字塔顶层
            {"CardFace": 12, "CardSuit": 0, "Position": {"x": 0, "y": 200}},
            # 第二层
            {"CardFace": 2, "CardSuit": 0, "Position": {"x": -60, "y": 50}},
            {"CardFace": 2, "CardSuit": 1, "Position": {"x": 60, "y": 50}},
            # 第三层
            {"CardFace": 2, "CardSuit": 0, "Position": {"x": -120, "y": -100}},
            {"CardFace": 2, "CardSuit": 0, "Position": {"x": 0, "y": -100}},
            {"CardFace": 1, "CardSuit": 3, "Position": {"x": 120, "y": -100}}
        ],
        "Stack": [ # 备用牌堆都在 0,0 (相对于 StackArea)
            {"CardFace": 2, "CardSuit": 0, "Position": {"x": 0, "y": 0}},
            {"CardFace": 0, "CardSuit": 2, "Position": {"x": 0, "y": 0}},
            {"CardFace": 3, "CardSuit": 0, "Position": {"x": 0, "y": 0}}
        ]
    }
    # 确保目录存在
    os.makedirs(os.path.dirname(LEVEL_PATH), exist_ok=True)
    with open(LEVEL_PATH, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=4, ensure_ascii=False)

    print("All visual fixes applied!")

if __name__ == '__main__':
    fix_view()
