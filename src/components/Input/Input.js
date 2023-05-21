
const Input = ({ title, label, type, register, valueAsNumber }) => {
    return (
        <div className='container flex flex-col pr-10'>
            <label>{title}</label>
            <input
            type={type}
            className='text-black border-solid border border-black rounded'
            defaultValue=''
            {...register(label, { valueAsNumber,  min: -100, max: 10000})}
            />
        </div>
    );
}

export const DecimalInput = ({ title, label, type, register, valueAsNumber }) => {
    return (
        <div className='container flex flex-col pr-10'>
            <label>{title}</label>
            <input
            type={type}
            className='text-black border-solid border border-black rounded'
            step="0.01"
            defaultValue=''
            {...register(label, { valueAsNumber, min: -100, max: 10000})}
            />
        </div>
    );
}

export default Input