/**
 * 数组辅助工具类
 * 提供数组相关的通用功能
 */
export class ArrayHelper {
    /**
     * 从数组中随机选择一个元素
     * @param array 数组
     * @returns 随机元素
     */
    static randomElement<T>(array: T[]): T | null {
        if (array.length === 0) return null;
        const index = Math.floor(Math.random() * array.length);
        return array[index];
    }

    /**
     * 打乱数组顺序（Fisher-Yates 洗牌算法）
     * @param array 数组
     * @returns 打乱后的新数组
     */
    static shuffle<T>(array: T[]): T[] {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    /**
     * 从数组中移除指定元素
     * @param array 数组
     * @param element 要移除的元素
     * @returns 是否成功移除
     */
    static remove<T>(array: T[], element: T): boolean {
        const index = array.indexOf(element);
        if (index > -1) {
            array.splice(index, 1);
            return true;
        }
        return false;
    }
}

