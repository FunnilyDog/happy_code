import { IGeneralFieldState } from "@formily/core";
import { ISchema } from "@formily/react";

export type SchemaReactionEffect =
  | "onFieldInit"
  | "onFieldMount"
  | "onFieldUnmount"
  | "onFieldValueChange"
  | "onFieldInputValueChange"
  | "onFieldInitialValueChange"
  | "onFieldValidateStart"
  | "onFieldValidateEnd"
  | "onFieldValidateFailed"
  | "onFieldValidateSuccess";

export type SchemaReaction<Field = any> =
  | {
      dependencies?: string[] | Record<string, string>; //依赖的字段路径列表，只能以点路径描述依赖，支持相对路径，如果是数组格式，那么读的时候也是数组格式，如果是对象格式，读的时候也是对象格式，只是对象格式相当于是一个alias
      when?: string | boolean; //联动条件
      target?: string; //要操作的字段路径，支持FormPathPattern路径语法，注意：不支持相对路径！！
      effects?: SchemaReactionEffect[]; //主动模式下的独立生命周期钩子
      fulfill?: {
        //满足条件
        state?: IGeneralFieldState; //更新状态
        schema?: ISchema; //更新Schema
        run?: string; //执行语句
      };
      otherwise?: {
        //不满足条件
        state?: IGeneralFieldState; //更新状态
        schema?: ISchema; //更新Schema
        run?: string; //执行语句
      };
    }
  | ((field: Field) => void); //可以复杂联动

export type SchemaReactions<Field = any> =
  | SchemaReaction<Field>
  | SchemaReaction<Field>[];
