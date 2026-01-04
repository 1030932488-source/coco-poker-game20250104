# -*- coding: utf-8 -*-
"""缩小Card预制体的尺寸"""
import json

def shrink_card_size():
    file_path = r'd:\coco_poker\assets\prefabs\Card.prefab'
    
    # 读取文件
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 新的卡牌尺寸(更小)
    new_width = 100
    new_height = 140
    
    modified_count = 0
    for item in data:
        if isinstance(item, dict) and item.get('__type__') == 'cc.UITransform':
            content_size = item.get('_contentSize', {})
            old_width = content_size.get('width', 0)
            old_height = content_size.get('height', 0)
            
            # 修改主节点的UITransform(之前改成150x200的)
            if old_width == 150 and old_height == 200:
                item['_contentSize'] = {
                    "__type__": "cc.Size",
                    "width": new_width,
                    "height": new_height
                }
                modified_count += 1
                print(f'修改 UITransform: {old_width}x{old_height} -> {new_width}x{new_height}')
    
    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f'总共修改了 {modified_count} 个 UITransform')
    return modified_count > 0

if __name__ == '__main__':
    shrink_card_size()
