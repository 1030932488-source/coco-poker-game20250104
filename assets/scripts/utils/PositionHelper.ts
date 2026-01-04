import { Vec2 } from 'cc';

/**
 * 位置辅助工具类
 * 提供位置相关的通用功能
 */
export class PositionHelper {
    /**
     * 计算两点之间的距离
     * @param pos1 位置1
     * @param pos2 位置2
     * @returns 距离
     */
    static distance(pos1: Vec2, pos2: Vec2): number {
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 计算两点之间的角度（弧度）
     * @param from 起始位置
     * @param to 目标位置
     * @returns 角度（弧度）
     */
    static angle(from: Vec2, to: Vec2): number {
        return Math.atan2(to.y - from.y, to.x - from.x);
    }

    /**
     * 将世界坐标转换为本地坐标
     * @param worldPos 世界坐标
     * @param parentNode 父节点
     * @returns 本地坐标
     */
    static worldToLocal(worldPos: Vec2, parentNode: any): Vec2 {
        // 这里需要根据实际使用的节点类型实现
        // 简化实现，实际使用时需要根据 Cocos Creator 的 API 调整
        return worldPos.clone();
    }
}

