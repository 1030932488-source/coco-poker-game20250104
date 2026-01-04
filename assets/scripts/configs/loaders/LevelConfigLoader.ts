import { LevelConfig } from '../models/LevelConfig';
import { resources, JsonAsset } from 'cc';
import { Logger } from '../../utils/Logger';

/**
 * 关卡配置加载器
 * 负责加载和解析关卡配置文件
 */
export class LevelConfigLoader {
    /**
     * 加载关卡配置
     * @param levelId 关卡ID
     * @returns 关卡配置数据
     */
    static loadLevelConfig(levelId: number): LevelConfig {
        // 尝试从资源文件加载
        const configPath = `configs/level${levelId}`;
        
        // 注意：在 Cocos Creator 中，resources.load 是异步的
        // 这里提供同步和异步两种方式
        // 实际使用时建议使用异步方式，这里先提供同步的默认配置
        
        try {
            // 如果资源已预加载，可以直接获取
            // 这里先返回默认配置，实际项目中应该使用异步加载
            return this.getDefaultLevelConfig();
        } catch (error) {
            Logger.warn(`无法加载关卡配置 level${levelId}，使用默认配置`, error);
            return this.getDefaultLevelConfig();
        }
    }

    /**
     * 异步加载关卡配置
     * @param levelId 关卡ID
     * @returns Promise<LevelConfig>
     */
    static async loadLevelConfigAsync(levelId: number): Promise<LevelConfig> {
        return new Promise((resolve, reject) => {
            const configPath = `configs/level${levelId}`;
            resources.load(configPath, JsonAsset, (err, asset: JsonAsset) => {
                if (err) {
                    Logger.warn(`无法加载关卡配置 level${levelId}，使用默认配置`, err);
                    resolve(this.getDefaultLevelConfig());
                    return;
                }
                
                try {
                    const config = asset.json as LevelConfig;
                    resolve(config);
                } catch (error) {
                    Logger.error(`解析关卡配置失败 level${levelId}`, error);
                    resolve(this.getDefaultLevelConfig());
                }
            });
        });
    }

    /**
     * 获取默认关卡配置（示例）
     */
    private static getDefaultLevelConfig(): LevelConfig {
        return {
            Playfield: [
                { CardFace: 12, CardSuit: 0, Position: { x: 250, y: 1000 } },
                { CardFace: 2, CardSuit: 0, Position: { x: 300, y: 800 } },
                { CardFace: 2, CardSuit: 1, Position: { x: 350, y: 600 } },
                { CardFace: 2, CardSuit: 0, Position: { x: 850, y: 1000 } },
                { CardFace: 2, CardSuit: 0, Position: { x: 800, y: 800 } },
                { CardFace: 1, CardSuit: 3, Position: { x: 750, y: 600 } }
            ],
            Stack: [
                { CardFace: 2, CardSuit: 0, Position: { x: 0, y: 0 } },
                { CardFace: 0, CardSuit: 2, Position: { x: 0, y: 0 } },
                { CardFace: 3, CardSuit: 0, Position: { x: 0, y: 0 } }
            ]
        };
    }
}

