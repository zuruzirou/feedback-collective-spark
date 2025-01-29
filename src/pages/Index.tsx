import { SurveyForm } from "@/components/SurveyForm";

const Index = () => {
  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-primary to-secondary">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          先端技術勉強会 フィードバックアンケート
        </h1>
        <SurveyForm />
      </div>
    </div>
  );
};

export default Index;