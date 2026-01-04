import json
import os

SCENE_PATH = r'd:\coco_poker\assets\scenes\GameScene.scene'
GAME_VIEW_TYPE = "aa25eyiPYtCuLsjnCXmXwxl"

def bind_game_view():
    print(f"Binding GameView in {SCENE_PATH}...")
    if not os.path.exists(SCENE_PATH):
        print("Scene file not found!")
        return

    with open(SCENE_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 1. 扫描节点和组件
    node_map = {} # name -> id
    node_components = {} # node_id -> [comp_id, ...]
    
    # 先找所有节点
    for i, item in enumerate(data):
        if item.get('__type__') == 'cc.Node':
            name = item.get('_name')
            if name:
                node_map[name] = i
            
            # 记录组件引用
            comps = item.get('_components', [])
            if comps:
                node_components[i] = [c['__id__'] for c in comps if '__id__' in c]

    # 2. 准备目标 ID
    targets = {
        "playfieldArea": {"type": "Node", "name": "PlayfieldArea", "id": None},
        "stackArea": {"type": "Node", "name": "StackArea", "id": None},
        "baseCardArea": {"type": "Node", "name": "BaseCardArea", "id": None},
        "undoButton": {"type": "Component", "name": "UndoButton", "compType": "cc.Button", "id": None},
        "scoreLabel": {"type": "Component", "name": "ScoreLabel", "compType": "cc.Label", "id": None},
    }

    # 查找 Node ID
    for key, info in targets.items():
        if info['name'] in node_map:
            node_id = node_map[info['name']]
            if info['type'] == 'Node':
                info['id'] = node_id
                print(f"Found Node '{info['name']}' at index {node_id}")
            else:
                # 查找组件 ID
                if node_id in node_components:
                    for comp_id in node_components[node_id]:
                        if comp_id < len(data):
                            comp_data = data[comp_id]
                            if comp_data.get('__type__') == info['compType']:
                                info['id'] = comp_id
                                print(f"Found Component '{info['compType']}' on '{info['name']}' at index {comp_id}")
                                break
    
    # 3. 找到 GameView 组件并绑定
    game_view_idx = -1
    for i, item in enumerate(data):
        if item.get('__type__') == GAME_VIEW_TYPE:
            game_view_idx = i
            print(f"Found GameView component at index {i}")
            
            # 执行绑定
            for key, info in targets.items():
                if info['id'] is not None:
                    item[key] = {"__id__": info['id']}
                    print(f"  Bound {key} -> {info['id']}")
                else:
                    print(f"  Warning: Could not find target for {key}")
            break
            
    if game_view_idx == -1:
        print("Error: GameView component not found in scene!")
        return

    # 4. 保存
    with open(SCENE_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Binding complete.")

if __name__ == '__main__':
    bind_game_view()
