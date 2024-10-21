interface FormConfirmationItemProps {
  title: string;
  text: string;
  classNames?: string;
}

export default function FormConfirmationItem(props: FormConfirmationItemProps) {
  return (
    <div className={`${props.classNames} flex flex-col gap-1.5`}>
      <h2 className="text-xs font-bold">{props.title}</h2>
      <p className="border-destructive text-sm">
        {props.text ? props.text : "未設定"}
      </p>
    </div>
  );
}
