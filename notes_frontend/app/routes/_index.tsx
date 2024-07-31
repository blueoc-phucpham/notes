import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function NoteList() {
  const notes = [
    {
      title: "Grocery List",
      content: "Milk, eggs, bread, apples, chicken, pasta",
    },
    {
      title: "Meeting Agenda",
      content:
        "1. Project updates 2. Budget review 3. Team concerns 4. Next steps",
    },
    {
      title: "Book Recommendations",
      content:
        "1984 by George Orwell, To Kill a Mockingbird by Harper Lee, The Great Gatsby by F. Scott Fitzgerald",
    },
    {
      title: "Workout Plan",
      content:
        "Monday: Cardio, Tuesday: Upper body, Wednesday: Rest, Thursday: Lower body, Friday: Full body, Weekend: Yoga",
    },
    {
      title: "Gift Ideas",
      content:
        "Mom: Scarf, Dad: Grilling set, Sister: Cookbook, Brother: Headphones",
    },
    {
      title: "Travel Packing List",
      content: "Passport, chargers, toiletries, clothes, camera, first-aid kit",
    },
    {
      title: "Recipe: Chocolate Chip Cookies",
      content:
        "Ingredients: flour, sugar, butter, eggs, chocolate chips. Mix dry ingredients, cream butter and sugar, combine all, bake at 350°F for 10-12 minutes.",
    },
    {
      title: "Home Improvement Tasks",
      content:
        "Paint living room, fix leaky faucet, clean gutters, organize garage",
    },
    {
      title: "Language Learning Goals",
      content:
        "Learn 10 new words per week, practice speaking for 30 minutes daily, watch one foreign film per month",
    },
    {
      title: "Project Deadlines",
      content:
        "Research: June 15, First Draft: July 1, Revisions: July 15, Final Submission: August 1",
    },
  ];

  return (
    <div className="flex flex-col gap-2 items-center py-6">
      {notes.map((item) => (
        <Note {...item}></Note>
      ))}
    </div>
  );
}

function Note(note: { title: string; content: string }) {
  return (
    <Card className="w-1/2">
      <Card>
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{note.content}</p>
        </CardContent>
      </Card>
    </Card>
  );
}
