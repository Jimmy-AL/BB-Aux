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
                <div class="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1 opacity-0 group-hover:opacity-100 transition duration-300 bg-slate-700 rounded p-2">
                    {message}
                </div>
                <QuestionMarkCircleIcon className="h-5 w-5 relative bottom-0 right-0 text-black"/>
            </div>
            {//<QuestionMarkCircleIcon className="h-5 w-5 relative bottom-0 right-0 text-black"/>
            }
        </div>
    );
}

export default Checkbox