import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface RequirementsFieldProps {
  name: string;
  label: string;
  register: any; // Adjust type as per react-hook-form
  setValue: any; // Adjust type as per your usage
  errors: any; // Adjust type as per your usage
  getValues: any; // Adjust type as per your usage
}

export default function RequirementsField({
  name,
  label,
  register,
  setValue,
  errors,
}: RequirementsFieldProps) {
  const { editCourse, course } = useSelector((state: any) => state.course);
  const [requirement, setRequirement] = useState<string>(""); // Explicitly specify string type
  const [requirementsList, setRequirementsList] = useState<string[]>([]); // Specify string[] type

  useEffect(() => {
    if (editCourse) {
      setRequirementsList(course?.instructions || []); // Initialize with course.instructions or empty array
    }
    register(name, { required: true }); // Ensure required validation is registered
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue(name, requirementsList); // Update form value when requirementsList changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirementsList]);

  const handleAddRequirement = () => {
    if (requirement) {
      setRequirementsList([...requirementsList, requirement]);
      setRequirement("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    const updatedRequirements = [...requirementsList];
    updatedRequirements.splice(index, 1);
    setRequirementsList(updatedRequirements);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>
      <div className="flex flex-col items-start space-y-2">
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className="form-style w-full"
        />
        <button
          type="button"
          onClick={handleAddRequirement}
          className="font-semibold text-yellow-50"
        >
          Add
        </button>
      </div>
      {requirementsList.length > 0 && (
        <ul className="mt-2 list-inside list-disc">
          {requirementsList.map((requirement, index) => (
            <li key={index} className="flex items-center text-richblack-5">
              <span>{requirement}</span>
              <button
                type="button"
                className="ml-2 text-xs text-pure-greys-300 "
                onClick={() => handleRemoveRequirement(index)}
              >
                clear
              </button>
            </li>
          ))}
        </ul>
      )}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}
