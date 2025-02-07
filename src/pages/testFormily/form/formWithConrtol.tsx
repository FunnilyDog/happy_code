import { createForm } from "@formily/core";
import {
  createSchemaField,
  Field,
  FormConsumer,
  FormProvider
} from "@formily/react";
import { FormItem, FormGrid, Submit } from "@formily/antd-v5";
import { Select, Input } from "antd";
import { defaultSchema, effects } from "./schema";

const { Option } = Select;
const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    FormGrid
  }
});
const form = createForm({
  effects
});
const Index = () => {
  return (
    <>
      <h2>联动</h2>
      <div>111</div>
      <FormProvider form={form}>
        <SchemaField schema={defaultSchema} />
        <Submit onSubmit={console.log}>提交</Submit>
      </FormProvider>
    </>
  );
};

export default Index;
