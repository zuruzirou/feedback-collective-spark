import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
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

  const calculateAverages = () => {
    const results = JSON.parse(localStorage.getItem('surveyResults') || '[]');
    const departments = ['1Biz', '2Biz', '3Biz', '4Biz'];
    
    return departments.map(dept => {
      const deptResults = results.filter((r: any) => r.department === dept);
      if (deptResults.length === 0) return { department: dept, satisfaction: 0, difficulty: 0, pace: 0 };
      
      return {
        department: dept,
        satisfaction: Number((deptResults.reduce((acc: number, curr: any) => acc + curr.satisfaction, 0) / deptResults.length).toFixed(2)),
        difficulty: Number((deptResults.reduce((acc: number, curr: any) => acc + curr.difficulty, 0) / deptResults.length).toFixed(2)),
        pace: Number((deptResults.reduce((acc: number, curr: any) => acc + curr.pace, 0) / deptResults.length).toFixed(2)),
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