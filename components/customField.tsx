import { ErrorMessage, Field, FieldAttributes } from "formik";

interface FieldProps extends FieldAttributes<any> {
  lable: string;
}
function CustomField({ lable, ...props }: FieldProps) {
  return (
    <div className="flex flex-col  mb-4">
      <label className="font-Patua font-semibold" htmlFor={props.name}>
        {lable}
      </label>
      <Field
        {...props}
        className="border-[1px] border-gray-300 rounded-md 
      focus:border-blue-400 outline-none p-1 pl-2 font-Patua"
      />
      <ErrorMessage name={props.name}>
        {(msg) => <div className="text-red-500">{msg}</div>}
      </ErrorMessage>
    </div>
  );
}

export default CustomField;
