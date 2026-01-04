# -*- coding: utf-8 -*-
"""修复Card预制体的Layer设置"""
import json

def fix_card_layer():
    file_path = r'd:\coco_poker\assets\prefabs\Card.prefab'
    
    # 读取文件
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 要修改的Layer值
    old_layer = 33554432  # UI_2D层 (第25位)
    new_layer = 1073741824  # DEFAULT层 (第30位,Camera可见)
    
    modified_count = 0
    for item in data:
        if isinstance(item, dict) and '_layer' in item:
            if item['_layer'] == old_layer:
                item['_layer'] = new_layer
                modified_count += 1
                print(f'修改节点 {item.get("_name", "unnamed")} 的 _layer: {old_layer} -> {new_layer}')
    
    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f'总共修改了 {modified_count} 个节点的Layer设置')
    return modified_count > 0

if __name__ == '__main__':
    fix_card_layer()
