import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const AdminLink = () => {
  const navigate = useNavigate();

  return (
    <div className="form-container text-center">
      <h2 className="text-2xl font-bold mb-6">アンケート送信完了</h2>
      <p className="mb-6">ご協力ありがとうございました。</p>
      <p className="mb-4">管理者の方は以下のリンクから結果を確認できます：</p>
      <Button onClick={() => navigate('/admin')}>
        管理者ページへ
      </Button>
    </div>
  );
};