/* "use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/src/lib/utils"
import { buttonVariants } from "@/src/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function CalendarPc({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("flex justify-center items-center w-auto", className)}
      classNames={{
        months: "flex gap-2 space-y-4",
        month: "flex flex-col gap-1 text-bold space-y-4 capitalize",
        caption: "flex justify-center mt-4 relative items-center capitalize",
        caption_label: "text-2xl font-extrabold",
        nav: "space-x-1 flex items-center",
        nav_button: cn(buttonVariants({ variant: "outline" }),"bg-transparent p-0 opacity-50 hover:opacity-100"),
        nav_button_previous: "absolute left-1 md:left-2 w-[25px] md:w-[30px]",
        nav_button_next: "absolute right-1 md:right-2 w-[25px] md:w-[30px]",
        table: "w-full border-2 border-collapse space-y-1",
        head_row: "flex",
        head_cell: "font-bold text-xl md:text-2xl capitalize border-2 w-full m-0",
        row: "flex w-full m-0",
        cell: "border-2 w-full text-center text-2xl relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }),"w-auto text-2xl aria-selected:opacity-100 md:pt-6 md:pr-[13rem] md:pb-[6rem] md:pl-0 sm:p-[24px]"),
        day_range_end: "day-range-end",
        day_selected: "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        button: 'w-full',
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
CalendarPc.displayName = "Calendar"

export { CalendarPc }
 */