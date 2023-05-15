
const Input = ({ title, label, type, defaultValue, register, valueAsNumber }) => {
    return (
        <div>
            <span>{title}</span>
            <input
            type={type}
            defaultValue={defaultValue}
            {...register(label, { valueAsNumber,  })}
            />
        </div>
    );
}

export const DecimalInput = ({ title, label, defaultValue, register, valueAsNumber, errors }) => {
    return (
        <div>
            <span>{title}</span>
            <input 
                defaultValue={defaultValue}
                {...register(
                    label, 
                    { 
                        valueAsNumber, 
                        pattern: /^(0|[1-9]\d*)(\.\d+)?$/,
                        message: "Please enter a valid number."
                    }
                )}
            />
            {errors.label && <p>Please enter a valid number.</p>}
        </div>
    )
}

export default Input