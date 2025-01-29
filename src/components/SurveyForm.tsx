import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

type FormData = {
  department: string;
  joinYear: string;
  satisfaction: number;
  difficulty: number;
  pace: number;
};

const initialFormData: FormData = {
  department: '',
  joinYear: '',
  satisfaction: 0,
  difficulty: 0,
  pace: 0,
};

const departments = ['1Biz', '2Biz', '3Biz', '4Biz'];
const joinYears = ['2020年以前', '2021', '2022', '2023', '2024'];

export const SurveyForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 1 && (!formData.department || !formData.joinYear)) {
      toast({
        title: "エラー",
        description: "すべての項目を入力してください",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && (!formData.satisfaction || !formData.difficulty || !formData.pace)) {
      toast({
        title: "エラー",
        description: "すべての評価を入力してください",
        variant: "destructive",
      });
      return;
    }
    if (step === 3) {
      // Save to localStorage for demo purposes
      const existingData = JSON.parse(localStorage.getItem('surveyResults') || '[]');
      localStorage.setItem('surveyResults', JSON.stringify([...existingData, formData]));
      
      toast({
        title: "送信完了",
        description: "アンケートの回答ありがとうございました",
      });
      navigate('/admin-link');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const RatingButtons = ({ value, onChange }: { value: number; onChange: (val: number) => void }) => {
    return (
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            className={`rating-button ${value === num ? 'selected' : 'bg-secondary'}`}
            onClick={() => onChange(num)}
          >
            {num}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="form-container">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">
          {step === 1 && "基本情報"}
          {step === 2 && "講義の評価"}
          {step === 3 && "確認"}
        </h2>
        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full ${
                s === step ? 'bg-primary' : 'bg-secondary'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="form-step">
        {step === 1 && (
          <>
            <div className="input-group">
              <label className="block text-sm font-medium">所属部門</label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="部門を選択" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="input-group">
              <label className="block text-sm font-medium">入社年度</label>
              <Select
                value={formData.joinYear}
                onValueChange={(value) => setFormData({ ...formData, joinYear: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="入社年度を選択" />
                </SelectTrigger>
                <SelectContent>
                  {joinYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="input-group">
              <label className="block text-sm font-medium">全体的な満足度</label>
              <RatingButtons
                value={formData.satisfaction}
                onChange={(val) => setFormData({ ...formData, satisfaction: val })}
              />
            </div>
            <div className="input-group">
              <label className="block text-sm font-medium">内容の難易度は適切でしたか</label>
              <RatingButtons
                value={formData.difficulty}
                onChange={(val) => setFormData({ ...formData, difficulty: val })}
              />
              <span className="text-xs text-gray-500">1: 簡単すぎる - 5: 難しすぎる</span>
            </div>
            <div className="input-group">
              <label className="block text-sm font-medium">進行スピードは適切でしたか</label>
              <RatingButtons
                value={formData.pace}
                onChange={(val) => setFormData({ ...formData, pace: val })}
              />
            </div>
          </>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-medium">入力内容の確認</h3>
            <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
              <p>所属部門: {formData.department}</p>
              <p>入社年度: {formData.joinYear}</p>
              <p>満足度: {formData.satisfaction}</p>
              <p>難易度: {formData.difficulty}</p>
              <p>進行スピード: {formData.pace}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              戻る
            </Button>
          )}
          <Button className="ml-auto" onClick={handleNext}>
            {step === 3 ? '送信' : '次へ'}
          </Button>
        </div>
      </div>
    </div>
  );
};