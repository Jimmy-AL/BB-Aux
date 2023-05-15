
const Checkbox = ({ title, label, register }) => {
    return (
        <>
            <label>
                <input
                type="Checkbox"
                {...register(label)}
                />
                {title}
            </label>
        </>
    );
}

export default Checkbox