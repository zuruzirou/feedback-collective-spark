import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (password === 'admin') {
      setIsAuthenticated(true);
    } else {
      toast({
        title: "エラー",
        description: "パスワードが正しくありません",
        variant: "destructive",
      });
    }
  };

  const { data: surveyResults, isLoading, error } = useQuery({
    queryKey: ['surveyResults'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('survey_results')
        .select('*');
      
      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated,
  });

  const calculateAverages = () => {
    if (!surveyResults) return [];
    
    const departments = ['1Biz', '2Biz', '3Biz', '4Biz'];
    
    return departments.map(dept => {
      const deptResults = surveyResults.filter(r => r.department === dept);
      if (deptResults.length === 0) return { department: dept, satisfaction: 0, difficulty: 0, pace: 0 };
      
      return {
        department: dept,
        satisfaction: Number((deptResults.reduce((acc, curr) => acc + curr.satisfaction, 0) / deptResults.length).toFixed(2)),
        difficulty: Number((deptResults.reduce((acc, curr) => acc + curr.difficulty, 0) / deptResults.length).toFixed(2)),
        pace: Number((deptResults.reduce((acc, curr) => acc + curr.pace, 0) / deptResults.length).toFixed(2)),
      };
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="form-container">
        <h2 className="text-2xl font-bold mb-6">管理者ログイン</h2>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="パスワードを入力"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleLogin} className="w-full">
            ログイン
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="form-container">データを読み込み中...</div>;
  }

  if (error) {
    return <div className="form-container">エラーが発生しました: {error.message}</div>;
  }

  const averages = calculateAverages();

  return (
    <div className="form-container">
      <h2 className="text-2xl font-bold mb-6">アンケート結果集計</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>部門</TableHead>
            <TableHead>満足度</TableHead>
            <TableHead>難易度</TableHead>
            <TableHead>進行スピード</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {averages.map((avg) => (
            <TableRow key={avg.department}>
              <TableCell>{avg.department}</TableCell>
              <TableCell>{avg.satisfaction}</TableCell>
              <TableCell>{avg.difficulty}</TableCell>
              <TableCell>{avg.pace}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};