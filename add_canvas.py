# -*- coding: utf-8 -*-
"""为Canvas节点添加Canvas组件,启用UI渲染"""
import json

def add_canvas_component():
    file_path = r'd:\coco_poker\assets\scenes\GameScene.scene'
    
    # 读取文件
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 找到Canvas节点
    canvas_node_id = None
    for i, item in enumerate(data):
        if isinstance(item, dict) and item.get('_name') == 'Canvas' and item.get('__type__') == 'cc.Node':
            canvas_node_id = i
            print(f'找到Canvas节点: index={i}')
            print(f'当前组件: {item.get("_components")}')
            break
    
    if canvas_node_id is None:
        print('未找到Canvas节点!')
        return False
    
    # 创建Canvas组件
    canvas_component_id = len(data)
    canvas_component = {
        "__type__": "cc.Canvas",
        "_name": "",
        "_objFlags": 0,
        "__editorExtras__": {},
        "node": {
            "__id__": canvas_node_id
        },
        "_enabled": True,
        "__prefab": None,
        "_cameraComponent": {
            "__id__": 7  # 指向Camera组件
        },
        "_alignCanvasWithScreen": True,
        "_id": "canvas_component_auto"
    }
    
    # 添加组件到数据中
    data.append(canvas_component)
    
    # 更新Canvas节点的_components数组
    canvas_node = data[canvas_node_id]
    canvas_node['_components'].append({"__id__": canvas_component_id})
    print(f'已添加Canvas组件: index={canvas_component_id}')
    print(f'更新后组件: {canvas_node["_components"]}')
    
    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print('Canvas组件添加成功!')
    return True

if __name__ == '__main__':
    add_canvas_component()
