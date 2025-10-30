import { MapPin, Camera, CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useState, type ChangeEvent } from "react";
import {useForm, type SubmitHandler, Controller} from "react-hook-form";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns"
import { PhoneInput } from "../auth/phone-input";

const birthDate = z
.date({})
.refine((date) => {
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  return date <= eighteenYearsAgo;
}, {
  message: "You must be at least 18 years old.",
});

const schema= z.object({
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  name: z.string().min(1, { message: "Name is required" }),
  dob:birthDate
})

type FormField=z.infer<typeof schema>;

export const ProfileInfo = () => {
   const [date] = useState<Date | undefined>(
    new Date(2025, 5, 12)
  )
  const [dropdown] =useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
      "dropdown")

  const [avatar, setAvatar] = useState("../../public/profile.png");

  const { register, handleSubmit, formState: { errors }, control } = useForm<FormField>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormField> = data => console.log(data);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file); 
      setAvatar(url);
    }
  };
  
  return (
   <>
   
   <Card className="border-0 items-center justify-between p-1 sm:p-2 cursor-pointer">
      <div className="flex flex-col justify-center items-center relative">
        {/* Avatar Image */}
        <img
          src="../../public/profile.png"
          alt="User Avatar"
          width={96}
          height={96}
          className="rounded-full object-cover border-1"
        />

      
        <div
          className="absolute bottom-13 right-3 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100 transition"
          onClick={() => document.getElementById("avatarInput")?.click()}
        >
          <Camera className="w-5 h-5 text-gray-700" />
        </div>


        <input
          type="file"
          id="avatarInput"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

      
        <div className="flex flex-col items-center mt-2">
          <p className="p-1 text-base font-semibold text-foreground">John Doe</p>
          <div className="flex items-center text-sm text-muted-foreground mt-0.5">
            <MapPin className="w-4 h-4 mr-1" />
            <span>San Francisco, CA</span>
          </div>
        </div>
      </div>
    </Card>

    <Card className="border-0 w-full max-w-md flex justify-center mx-auto">
        <CardContent >
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <Input className="border-0 bg-[#F5F6F7]" placeholder="Seif Mohamed" {...register("name")} />
              {errors.name && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col">
              <Input className="border-0 bg-[#F5F6F7]" placeholder="Seifmohamed@gmail.com" type="email" {...register("email")} />
              {errors.email && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.email.message}</span>}
            </div>

          
           <Controller
  control={control}
  name="phone"
  render={({ field }) => (
    <PhoneInput
      {...field}               
      className="bg-white"
      defaultCountry="EG"
      placeholder="01**********"
    />
  )}
/>

           

            <div className="flex flex-col">
    <Controller
        control={control} 
        name="dob"       
        render={({ field }) => (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        className={`w-full justify-start text-left font-normal bg-[#F5F6F7] hover:cursor-pointer ${!field.value && "text-muted-foreground"}`}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Select date of birth</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 bg-white shadow-lg rounded-md border-0">
                    <Calendar
                   
                        mode="single"
                        defaultMonth={date}
                        selected={field.value}
                        onSelect={field.onChange} // Crucial: This calls React Hook Form's onChange
                        disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")}
                        captionLayout={dropdown}
                    />
                </PopoverContent>
            </Popover>
        )}
    />
    {/* Display error message if it exists */}
    {errors.dob && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.dob.message}</span>}
</div>


            <Button type="submit" className="text-white mt-2 w-full bg-[#145DB8] hover:bg-[#145DB8] hover:cursor-pointer">Edit Profile</Button>
          </form>

        </CardContent>
      </Card>
   </>
  )
}
