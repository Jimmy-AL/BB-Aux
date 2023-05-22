import {QuestionMarkCircleIcon} from '@heroicons/react/20/solid'

const Input = ({ title, label, type, register, valueAsNumber, errors, hint, message }) => {
    return (
        <div className='container relative flex flex-col pr-10'>
            <div className='container flex relative mb-2'>
                <label className='mr-2'>{title}</label>
                {hint
                    ?<div class="group relative inline-block">
                        <div class="absolute bottom-6 left-4 opacity-0 group-hover:opacity-100 transition duration-300 bg-opacity-95 bg-slate-700 rounded p-2 w-96 pointer-events-none">
                            {message}
                        </div>
                        <QuestionMarkCircleIcon className="h-5 w-5 relative inset-y-1 -left-1 text-black"/>
                    </div>
                    //<QuestionMarkCircleIcon className="h-5 w-5 absolute bottom-0 right-0 text-black"/>
                    : <></>}
                
            </div>
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

export const DecimalInput = ({ title, label, type, register, valueAsNumber, errors, hint, message }) => {
    return (
        <div className='container flex flex-col pr-10'>
            <div className='container flex relative mb-2'>
                <label className='mr-2'>{title}</label>
                {hint
                    ? <div class="group relative inline-block">
                        <div class="absolute bottom-6 left-4 opacity-0 group-hover:opacity-100 transition duration-300 bg-opacity-95 bg-slate-700 rounded p-2 pointer-events-none w-96">
                            {message}
                        </div>
                        <QuestionMarkCircleIcon className="h-5 w-5 relative inset-y-1 -left-1 text-black"/>
                    </div>
                    : <></>}
            </div>
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