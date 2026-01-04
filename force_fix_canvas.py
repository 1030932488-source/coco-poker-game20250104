import json
import os
import uuid

SCENE_PATH = r'd:\coco_poker\assets\scenes\GameScene.scene'

def force_fix():
    print(f"Force fixing {SCENE_PATH}...")
    if not os.path.exists(SCENE_PATH):
        print("Scene file not found!")
        return

    with open(SCENE_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    canvas_node_id = None
    canvas_node_idx = -1
    
    # 1. 找到 Canvas 节点
    for i, item in enumerate(data):
        if item.get('__type__') == 'cc.Node' and item.get('_name') == 'Canvas':
            canvas_node_idx = i
            canvas_node = item
            canvas_node_id = i # __id__引用就是索引
            print(f"Located Canvas Node at index {i}")
            break
            
    if canvas_node_idx == -1:
        print("Critical: Canvas node not found!")
        return

    # 2. 找到它绑定的 UITransform 组件
    uitransform_idx = -1
    if '_components' in canvas_node:
        for comp_ref in canvas_node['_components']:
            comp_idx = comp_ref['__id__']
            if comp_idx < len(data):
                comp = data[comp_idx]
                if comp.get('__type__') == 'cc.UITransform':
                    uitransform_idx = comp_idx
                    print(f"Located UITransform at index {uitransform_idx}")
                    break
    
    # 3. 强制重写 UITransform
    # 如果找到了，就覆盖；如果没找到，这个脚本暂时很难插入新组件(因为要改数组位置)，
    # 但Canvas必须有UITransform，否则场景早坏了。
    if uitransform_idx != -1:
        print("Overwriting UITransform with clean standard data...")
        # 保留原有的 _id，防止编辑器引用丢失
        original_id = data[uitransform_idx].get('_id')
        if not original_id:
            original_id = str(uuid.uuid4())

        # 标准的 Canvas UITransform 数据结构
        clean_uitransform = {
            "__type__": "cc.UITransform",
            "_name": "",
            "_objFlags": 0,
            "__editorExtras__": {},
            "node": {
                "__id__": canvas_node_idx
            },
            "_enabled": True,
            "__prefab": None,
            "_contentSize": {
                "__type__": "cc.Size",
                "width": 1080.0,
                "height": 2080.0
            },
            "_anchorPoint": {
                "__type__": "cc.Vec2",
                "x": 0.5,
                "y": 0.5
            },
            "_id": original_id
        }
        
        data[uitransform_idx] = clean_uitransform
        print("Success: Canvas UITransform has been reset to standard 1080x2080.")
    else:
        print("Error: Canvas has no UITransform component linked! (This is rare)")

    # 4. 顺便检查一下 Layout (如果存在)
    # 有时候 Layout 组件损坏也会导致奇怪的报错，暂时先不管，聚焦核心报错

    with open(SCENE_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("Write complete.")

if __name__ == '__main__':
    force_fix()
