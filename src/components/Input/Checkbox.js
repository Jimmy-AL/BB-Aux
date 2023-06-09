import {QuestionMarkCircleIcon} from '@heroicons/react/20/solid'

const Checkbox = ({ title, label, register, message }) => {
    return (
        <div >
            <label >
                <input
                type="Checkbox"
                style={{ marginRight: '10px' }}
                {...register(label)}
                />
                {title}
            </label>
            <div class="group relative inline-block">
                <div class="absolute bottom-6 left-4 opacity-0 group-hover:opacity-100 transition duration-300 bg-opacity-95 bg-slate-700 rounded p-2 w-max pointer-events-none">
                    {message}
                </div>
                <QuestionMarkCircleIcon className="h-5 w-5 relative inset-y-1 inset-x-1 text-blue-950"/>
            </div>
            {//<QuestionMarkCircleIcon className="h-5 w-5 relative bottom-0 right-0 text-blue-900"/>
            }
        </div>
    );
}

export default Checkbox