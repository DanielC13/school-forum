<?php 
require_once 'phpexcel/Classes/PHPExcel.php';
require_once 'phpexcel/Classes/PHPExcel/IOFactory.php';

$objPHPExcel = new PHPExcel();

$objSheet = $objPHPExcel->getActiveSheet();
// rename the sheet


if(isset($_POST["submit"])){
    //$ck=$_POST["ck"];
    $name=$_POST["s_name"];
    $days=$_POST["day"];
    $month=$_POST["month"];
    $uid=$_POST["uid"];
    $count=count($name);
    $no=0;
    for($a=0;$a<$count;$a++){
        $ck=explode(",",$days[$a]);
        $objWorkSheet = $objPHPExcel->createSheet($a);
        $objWorkSheet->getCell(chr("65").'1')->setValue("No");
        $objWorkSheet->getCell(chr("66").'1')->setValue("DN");
        $objWorkSheet->getCell(chr("67").'1')->setValue("UID");
        $objWorkSheet->getCell(chr("68").'1')->setValue("Name");
        $objWorkSheet->getCell(chr("69").'1')->setValue("Status");
        $objWorkSheet->getCell(chr("70").'1')->setValue("Action");
        $objWorkSheet->getCell(chr("71").'1')->setValue("APB");
        $objWorkSheet->getCell(chr("72").'1')->setValue("Jobcode");
        $objWorkSheet->getCell(chr("73").'1')->setValue("Datetime");
        $no=1;
        $i=2;
        foreach($ck as $day){
            
            $in_1_t = mt_rand(mktime(8,45),mktime(8,59));
            $in_2_t = mt_rand(mktime(11,55),mktime(12,05));
            $out_1_t = mt_rand(mktime(12,45),mktime(12,59));
            $out_2_t = mt_rand(mktime(16,55),mktime(17,05));
            $friday = mt_rand(mktime(14,55),mktime(15,05));
            $d=$day."-".$month[$a]."-".$_POST["year"];
            $int=strtotime($d);
            
            if(date('w',$int) == 5){
                $time1=array($in_1_t,$in_2_t,$out_1_t,$friday);
            }else{
                $time1=array($in_1_t,$in_2_t,$out_1_t,$out_2_t);
            }
            //$time1=array($in_1_t,$in_2_t,$out_1_t,$out_2_t);
            if(date('w',$int) == 0 || date('w',$int) == 6){

            }else{
                foreach($time1 as $time){
                    $finaldate=$d." ".date('h:i:s a',$time);
                    $objWorkSheet->getCell(chr("65").$i)->setValue($no);
                    $objWorkSheet->getCell(chr("66").$i)->setValue("1");
                    $objWorkSheet->getCell(chr("67").$i)->setValue($uid[$a]);
                    $objWorkSheet->getCell(chr("68").$i)->setValue($name[$a]);
                    $objWorkSheet->getCell(chr("69").$i)->setValue("0");
                    $objWorkSheet->getCell(chr("70").$i)->setValue("1");
                    $objWorkSheet->getCell(chr("71").$i)->setValue("0");
                    $objWorkSheet->getCell(chr("72").$i)->setValue("0");
                    $objWorkSheet->getCell(chr("73").$i)->setValue($finaldate);
                    $no++;
                    $i++;
                }
            }
                
                
                
            
            }
            // for($i=1;$i<=count($finaldate);$i++){
            //     $row=-1+$i;
            //     $finaldate[$row];
                
            // }
            $objWorkSheet->setTitle($name[$a]);
    }
    
    
    
    
    
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="'.$_POST["name"].'.xlsx"');
header('Cache-Control: max-age=0');

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
$objWriter->save('php://output');
    
}



?>