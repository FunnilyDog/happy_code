// import { createForm } from "@formily/core";
// import { FormProvider, createSchemaField } from "@formily/react";
// import { FormItem, Input, FormGrid } from "@formily/antd-v5";
// import { Select } from "antd";
// import { DefaultSchema } from "./schema";

// const SchemaField = createSchemaField({
//   components: {
//     FormItem,
//     Input,
//     Select,
//     FormGrid
//   }
// });

// const form = createForm();

// export default () => {
//   return (
//     <FormProvider form={form}>
//       <SchemaField schema={DefaultSchema} />
//     </FormProvider>
//   );
// };

import { createForm } from "@formily/core";
import { FormProvider } from "@formily/react";
import { FormItem, Input } from "@formily/antd-v5";
import { Button } from "antd";

// 创建表单实例
const form = createForm();
export default () => {
  return (
    <FormProvider form={form}>
      <FormItem label="用户名" labelCol={6} style={{ width: "240px" }}>
        <Input name="username" placeholder="请输入用户名" />
      </FormItem>
      <FormItem label="密码" labelCol={6} style={{ width: "240px" }}>
        <Input name="password" type="password" placeholder="请输入密码" />
      </FormItem>
      <Button type="primary" htmlType="submit">
        提交
      </Button>
    </FormProvider>
  );
};
