
const Input = ({ title, label, type, register, valueAsNumber, errors }) => {
    return (
        <div className='container flex flex-col pr-10'>
            <label>{title}</label>
            <input
            type={type}
            className='text-black border-solid border border-black rounded'
            defaultValue=''
            {...register(label, { valueAsNumber, min: {value: -300, message: 'Minimum value is -300.'}, max: {value: '10000', message: 'Maximum value is 10000.'}})}
            />
            {errors[label] && <p className="error-message">{errors[label].message}</p>}
        </div>
    );
}

export const DecimalInput = ({ title, label, type, register, valueAsNumber, errors }) => {
    return (
        <div className='container flex flex-col pr-10'>
            <label>{title}</label>
            <input
            type={type}
            className='text-black border-solid border border-black rounded'
            step="0.01"
            defaultValue=''
            {...register(label, { valueAsNumber, min: {value: -300, message: 'Minimum value is -300.'}, max: {value: '10000', message: 'Maximum value is 10000.'}})}
            />
            {errors[label] && <p className="error-message">{errors[label].message}</p>}
        </div>
    );
}

export default Input