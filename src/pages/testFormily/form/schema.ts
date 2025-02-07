import { ISchema } from "@formily/react";
import { Field, IGeneralFieldState, onFieldReact } from "@formily/core";

export const defaultSchema: ISchema = {
  type: "object",
  properties: {
    grid: {
      type: "void",
      "x-component": "FormGrid",
      "x-component-props": {
        minColumns: 1,
        maxColumns: 3
      },
      properties: {
        isShow: {
          title: "控制显隐",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Input"
        },
        selectOptions: {
          type: "string",
          title: "控制选项",
          "x-component": "Select",
          "x-decorator": "FormItem",
          "x-component-props": {
            options: [
              { label: "性别", value: "sex" },
              { label: "爱好", value: "hobby" }
            ]
          }
        },
        remittanceName1: {
          type: "string",
          title: "账号",
          "x-component": "Select",
          "x-decorator": "FormItem",
          "x-component-props": {
            placeholder: "请先选择 控制选项"
          },
          "x-reactions": [
            {
              dependencies: ["selectOptions"],
              fulfill: {
                // schema: {
                //   "x-visible": "{{ $deps[0] === 'sex' }}" // 控制字段显示与隐藏
                // },
                state: {
                  visible: "{{ $deps[0] === 'sex' }}"
                },

                disabled: false, // 控制字段禁用与启用
                // 设置字段值,可以是具体的值，也可以是一个函数
                value: (val: any) => {
                  return val;
                },
                validate: true, // 触发表单校验
                // 执行副作用函数，比如异步请求、日志记录等。
                sideEffects: () => {
                  console.log("依赖字段 selectOptions 变更");
                },
                setProps: ""
              }
            },
            (field: Field) => {
              console.log("field", field);
              const remittanceName = field.query(".remittanceName5").value();
              if (remittanceName) {
                field.setComponentProps({
                  options: [
                    { label: "ajsl", value: "1" },
                    { label: "sfgr", value: "2" }
                  ]
                });
                field.setValue("1");
              } else {
                field.setComponentProps({
                  options: undefined
                });
                field.setValue(undefined);
              }
            }
          ]
        }
      }
    }
  }
};

export const effects = () => {
  onFieldReact("input", (field) => {
    field.display = field.query("select").value();
  });
};
