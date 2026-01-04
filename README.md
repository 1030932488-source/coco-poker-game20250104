# Cocos Creator 纸牌消除游戏

## 项目概述

这是一个基于 Cocos Creator 开发的纸牌消除游戏，采用 MVC 架构设计，实现了卡牌匹配、翻牌和回退等核心功能。

## 🎮 游戏演示

点击查看演示视频：[game_demo.mp4](demo.mp4)

> 提示：如果无法直接播放，请下载后观看。

## 游戏规则

### 基本玩法

1. **主牌区（Playfield）**：游戏区域上方显示需要消除的卡牌，卡牌可以正面朝上或背面朝上
2. **底牌堆（Base Card）**：游戏区域下方显示当前底牌，需要与主牌区的牌进行匹配
3. **备用牌堆（Stack）**：当主牌区无可匹配的牌时，可以从备用牌堆翻新牌

### 消除规则

- **匹配条件**：点击主牌区的牌，如果该牌的点数与底牌点数相差1（大1或小1），则可以匹配消除
- **花色限制**：无花色限制，只要点数差1即可匹配
- **示例**：如果底牌是"8"，可以匹配"7"或"9"
- **翻牌规则**：当主牌区无可匹配的牌时，可以点击备用牌堆翻新牌，翻出的牌会成为新的底牌

## 项目结构

```
assets/
├── scripts/
│   ├── configs/          # 配置层
│   │   ├── models/       # 配置数据模型
│   │   └── loaders/      # 配置加载器
│   ├── models/           # 数据模型层
│   ├── views/            # 视图层
│   ├── controllers/      # 控制器层
│   ├── managers/         # 管理器层
│   ├── services/         # 服务层
│   ├── enums/            # 枚举定义
│   └── scenes/           # 场景脚本
└── scenes/               # 场景文件
```

## 架构设计

### MVC 架构

项目采用 MVC（Model-View-Controller）架构，将数据、视图和逻辑分离：

- **Model（模型层）**：存储游戏数据和状态
- **View（视图层）**：负责UI显示和用户交互
- **Controller（控制器层）**：协调模型和视图，处理业务逻辑

### 各层职责

#### 1. Configs（配置层）

- **职责**：管理静态配置数据
- **示例**：`LevelConfig`（关卡配置）、`LevelConfigLoader`（配置加载器）

#### 2. Models（数据模型层）

- **职责**：存储运行时动态数据
- **特点**：支持序列化和反序列化（用于存档）
- **示例**：
  - `CardModel`：卡牌数据模型
  - `GameModel`：游戏状态模型
  - `UndoModel`：回退操作模型

#### 3. Views（视图层）

- **职责**：UI显示和用户输入接收
- **特点**：不包含业务逻辑，通过回调函数与控制器通信
- **示例**：
  - `CardView`：卡牌视图组件
  - `GameView`：游戏主视图
  - `PlayfieldView`：主牌区视图
  - `StackView`：备用牌堆视图
  - `BaseCardView`：底牌视图

#### 4. Controllers（控制器层）

- **职责**：协调模型和视图，处理业务逻辑
- **示例**：`GameController`：游戏主控制器

#### 5. Managers（管理器层）

- **职责**：提供全局性服务和功能，作为Controller的成员变量
- **特点**：可持有Model数据，禁止单例模式
- **示例**：`UndoManager`：回退管理器

#### 6. Services（服务层）

- **职责**：提供无状态的服务，处理业务逻辑
- **特点**：不持有数据，通过参数操作数据，可单例或静态方法
- **示例**：
  - `GameModelGenerator`：游戏模型生成服务
  - `CardMatchService`：卡牌匹配服务

## 核心功能实现

### 1. 卡牌匹配功能

**实现位置**：`GameController._matchCard()`

**流程**：

1. 用户点击主牌区的卡牌
2. `CardView` 捕获点击事件，通过回调通知 `GameController`
3. `GameController` 使用 `CardMatchService.canMatch()` 判断是否可以匹配
4. 如果可以匹配：
   - 记录回退信息到 `UndoManager`
   - 更新 `GameModel`：将匹配的卡牌设为新的底牌，标记为已移除
   - 调用 `PlayfieldView` 播放移动动画
   - 更新所有视图

**代码原理**：

```typescript
// 匹配判断逻辑（CardMatchService.ts）
static canMatch(baseCard: CardModel, targetCard: CardModel): boolean {
    const baseValue = baseCard.getValue();
    const targetValue = targetCard.getValue();
    const diff = Math.abs(baseValue - targetValue);
    return diff === 1; // 点数差为1即可匹配
}
```

### 2. 翻牌功能

**实现位置**：`GameController._flipStackCard()`

**流程**：

1. 检查主牌区是否有可匹配的牌
2. 如果没有，找到备用牌堆最上面一张未翻开的牌
3. 记录回退信息
4. 更新模型：翻开卡牌并设为新的底牌
5. 播放翻牌动画

**代码原理**：

```typescript
// 翻牌逻辑
private _flipStackCard(card: CardModel): void {
    // 记录回退信息
    const undoModel = new UndoModel(...);
    this._undoManager.addUndoRecord(undoModel);
    
    // 更新模型
    card.isFaceUp = true;
    this._gameModel.baseCard = card;
    
    // 播放动画
    this.stackView.playFlipAnimation(card.id, callback);
}
```

### 3. 回退功能

**实现位置**：`UndoManager.undo()`

**流程**：

1. 用户点击回退按钮
2. `GameView` 捕获点击，通知 `GameController`
3. `GameController` 调用 `UndoManager.undo()`
4. `UndoManager` 从回退栈中取出最后一条记录
5. 根据操作类型恢复游戏状态：
   - 恢复卡牌位置、状态
   - 恢复底牌
6. 更新视图

**代码原理**：

```typescript
// 回退管理器使用栈结构存储操作记录
private _undoStack: UndoModel[] = [];

// 执行回退时，从栈顶取出记录并恢复状态
public undo(gameModel: GameModel): boolean {
    if (this._undoStack.length === 0) return false;
    const undoRecord = this._undoStack.pop()!;
    return this._executeUndo(undoRecord, gameModel);
}
```

**为什么使用栈结构**：

- 后进先出（LIFO）特性符合回退操作的需求
- 每次操作都记录完整的状态信息，便于精确恢复
- 支持连续多次回退

## 代码设计原理

### 1. 为什么采用 MVC 架构？

- **职责分离**：数据、视图、逻辑各司其职，便于维护
- **可扩展性**：新增功能时只需修改对应层，不影响其他层
- **可测试性**：各层独立，便于单元测试

### 2. 为什么使用回调函数而不是直接调用？

- **解耦**：View 层不直接依赖 Controller，降低耦合度
- **灵活性**：可以轻松替换不同的回调实现
- **符合单一职责原则**：View 只负责显示，不处理业务逻辑

### 3. 为什么 Service 层不持有数据？

- **无状态**：Service 提供的是纯函数，不依赖内部状态
- **可复用**：同一个 Service 可以被多个 Controller 使用
- **易于测试**：无状态的函数更容易进行单元测试

### 4. 为什么 Manager 层禁止单例？

- **依赖注入**：作为 Controller 的成员，便于依赖注入和测试
- **避免全局状态**：防止意外的状态共享
- **生命周期管理**：由 Controller 管理生命周期，更清晰

## 扩展指南

### 如何添加新的卡牌类型？

1. **扩展枚举**（`CardEnums.ts`）：

```typescript
export enum CardFaceType {
    // ... 现有枚举
    JOKER = 13,  // 新增小丑牌
}
```

1. **更新模型**（`CardModel.ts`）：

```typescript
// CardModel 已经支持任意 CardFaceType，无需修改
```

1. **更新匹配规则**（`CardMatchService.ts`）：

```typescript
static canMatch(baseCard: CardModel, targetCard: CardModel): boolean {
    // 特殊处理小丑牌
    if (targetCard.face === CardFaceType.JOKER) {
        return true; // 小丑牌可以匹配任意牌
    }
    // ... 原有逻辑
}
```

### 如何添加新的回退类型？

1. **扩展枚举**（`UndoModel.ts`）：

```typescript
export enum UndoActionType {
    // ... 现有类型
    USE_SPECIAL_CARD = 'USE_SPECIAL_CARD',  // 新增特殊卡牌使用
}
```

1. **更新回退逻辑**（`UndoManager.ts`）：

```typescript
private _executeUndo(undoRecord: UndoModel, gameModel: GameModel): boolean {
    switch (undoRecord.actionType) {
        // ... 现有case
        case UndoActionType.USE_SPECIAL_CARD:
            // 实现特殊卡牌使用的回退逻辑
            break;
    }
}
```

1. **在 Controller 中记录**（`GameController.ts`）：

```typescript
// 使用特殊卡牌时
const undoModel = new UndoModel(
    UndoActionType.USE_SPECIAL_CARD,
    cardId,
    // ... 其他参数
);
this._undoManager.addUndoRecord(undoModel);
```

## 开发环境配置

### 环境要求

- Cocos Creator 3.8.0 或更高版本
- TypeScript 支持
- Node.js（用于包管理）

### 项目配置

1. **设计分辨率**：1080 x 2080
2. **主牌区尺寸**：1080 x 1500
3. **堆牌区尺寸**：1080 x 580

### 运行项目

1. 使用 Cocos Creator 打开项目
2. 在场景编辑器中创建 `GameScene` 场景
3. 添加 `GameController` 组件到场景节点
4. 配置各个 View 组件的引用
5. 运行项目

## 资源文件

项目需要以下资源文件：

- 卡牌正面图片（根据点数和花色）
- 卡牌背面图片
- UI 按钮图片
- 背景图片

资源文件应放置在 `assets/resources/` 目录下。

## 许可证

MIT License
