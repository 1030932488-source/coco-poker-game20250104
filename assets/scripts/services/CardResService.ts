import { resources, SpriteFrame, ImageAsset, Texture2D } from 'cc';
import { CardFaceType, CardSuitType } from '../enums/CardEnums';
import { Logger } from '../utils/Logger';

/**
 * 卡牌资源服务（无状态 + 内部缓存）
 * - 自动使用文档附带的 res.zip 资源（card_general / number / suits）
 * - 统一管理 SpriteFrame 的加载与缓存，避免 View 层到处 resources.load
 */
export class CardResService {
    private static _cache: Map<string, SpriteFrame> = new Map();
    private static _preloadPromise: Promise<void> | null = null;

    /**
     * 预加载所需的卡牌资源（建议在进入游戏时 await）
     */
    static preload(): Promise<void> {
        if (this._preloadPromise) return this._preloadPromise;

        const paths: string[] = [];
        paths.push('poker_res/card_general');

        // suits
        paths.push('poker_res/suits/club');
        paths.push('poker_res/suits/diamond');
        paths.push('poker_res/suits/heart');
        paths.push('poker_res/suits/spade');

        // numbers (big_red / big_black)
        const symbols = this._getAllFaceSymbols();
        for (const sym of symbols) {
            paths.push(`poker_res/number/big_red_${sym}`);
            paths.push(`poker_res/number/big_black_${sym}`);
        }

        this._preloadPromise = new Promise((resolve) => {
            let remaining = paths.length;
            if (remaining === 0) {
                resolve();
                return;
            }

            for (const p of paths) {
                // 方法1: 尝试直接加载 SpriteFrame 子资源（使用路径/spriteFrame）
                const spriteFramePath = `${p}/spriteFrame`;
                resources.load(spriteFramePath, SpriteFrame, (err: Error | null, asset: SpriteFrame | null) => {
                    if (!err && asset) {
                        this._cache.set(p, asset);
                        remaining--;
                        if (remaining <= 0) {
                            resolve();
                        }
                    } else {
                        // 方法2: 如果失败，尝试直接加载 SpriteFrame（让系统自动推断）
                        resources.load(p, SpriteFrame, (err2: Error | null, asset2: SpriteFrame | null) => {
                            if (!err2 && asset2) {
                                this._cache.set(p, asset2);
                            } else {
                                // 方法3: 如果还是失败，尝试加载主资源，然后从 ImageAsset 创建 SpriteFrame
                                resources.load(p, (err3: Error | null, asset3: any) => {
                                    if (!err3 && asset3) {
                                        if (asset3 instanceof SpriteFrame) {
                                            this._cache.set(p, asset3);
                                        } else if (asset3 instanceof ImageAsset) {
                                            // 从 ImageAsset 创建 SpriteFrame
                                            const texture = new Texture2D();
                                            texture.image = asset3;
                                            const spriteFrame = new SpriteFrame();
                                            spriteFrame.texture = texture;
                                            this._cache.set(p, spriteFrame);
                                        } else {
                                            Logger.warn(`CardResService: ${p} loaded but not SpriteFrame or ImageAsset, type: ${asset3?.constructor?.name}`);
                                        }
                                    } else {
                                        Logger.warn(`CardResService preload failed: ${p}`, err || err2 || err3);
                                    }

                                    remaining--;
                                    if (remaining <= 0) {
                                        resolve();
                                    }
                                });
                                return;
                            }

                            remaining--;
                            if (remaining <= 0) {
                                resolve();
                            }
                        });
                    }
                });
            }
        });

        return this._preloadPromise;
    }

    /**
     * 获取通用牌底（card_general）
     */
    static getCardGeneral(): SpriteFrame | null {
        return this._cache.get('poker_res/card_general') ?? null;
    }

    /**
     * 获取花色图标
     */
    static getSuit(suit: CardSuitType): SpriteFrame | null {
        const path = this._getSuitPath(suit);
        if (!path) return null;
        return this._cache.get(path) ?? null;
    }

    /**
     * 获取“大号数字”图标（红/黑由花色决定）
     */
    static getBigNumber(face: CardFaceType, suit: CardSuitType): SpriteFrame | null {
        const sym = this._getFaceSymbol(face);
        if (!sym) return null;
        const isRed = suit === CardSuitType.HEARTS || suit === CardSuitType.DIAMONDS;
        const color = isRed ? 'red' : 'black';
        const path = `poker_res/number/big_${color}_${sym}`;
        return this._cache.get(path) ?? null;
    }

    private static _getSuitPath(suit: CardSuitType): string | null {
        switch (suit) {
            case CardSuitType.CLUBS:
                return 'poker_res/suits/club';
            case CardSuitType.DIAMONDS:
                return 'poker_res/suits/diamond';
            case CardSuitType.HEARTS:
                return 'poker_res/suits/heart';
            case CardSuitType.SPADES:
                return 'poker_res/suits/spade';
            default:
                return null;
        }
    }

    private static _getFaceSymbol(face: CardFaceType): string | null {
        switch (face) {
            case CardFaceType.ACE:
                return 'A';
            case CardFaceType.TWO:
                return '2';
            case CardFaceType.THREE:
                return '3';
            case CardFaceType.FOUR:
                return '4';
            case CardFaceType.FIVE:
                return '5';
            case CardFaceType.SIX:
                return '6';
            case CardFaceType.SEVEN:
                return '7';
            case CardFaceType.EIGHT:
                return '8';
            case CardFaceType.NINE:
                return '9';
            case CardFaceType.TEN:
                return '10';
            case CardFaceType.JACK:
                return 'J';
            case CardFaceType.QUEEN:
                return 'Q';
            case CardFaceType.KING:
                return 'K';
            default:
                return null;
        }
    }

    private static _getAllFaceSymbols(): string[] {
        return ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    }
}


