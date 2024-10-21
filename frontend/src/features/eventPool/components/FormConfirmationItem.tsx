interface FormConfirmationItemProps {
  title: string;
  text: string;
  className?: string;
}

export default function FormConfirmationItem(props: FormConfirmationItemProps) {
  return (
    <div className={`${props.className} flex flex-col gap-1.5`}>
      <h2 className="text-sm font-bold">{props.title}</h2>
      <p className="border-destructive text-sm">
        {props.text ? props.text : "未設定"}
      </p>
    </div>
  );
}
