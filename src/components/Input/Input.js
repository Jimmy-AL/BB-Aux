
const Input = ({ title, label, type, register, valueAsNumber }) => {
    return (
        <div>
            <span>{title}</span>
            <input
            type={type}
            defaultValue=''
            {...register(label, { valueAsNumber,  })}
            />
        </div>
    );
}

export const DecimalInput = ({ title, label, type, register, valueAsNumber }) => {
    return (
        <div>
            <span>{title}</span>
            <input
            type={type}
            step="0.01"
            defaultValue=''
            {...register(label, { valueAsNumber,  })}
            />
        </div>
    );
}

export default Input