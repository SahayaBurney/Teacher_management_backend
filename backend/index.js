const express=require('express')
const app=express()
const cors=require('cors')
const fs = require('fs');
app.use(cors());
app.use(express.json());
app.post('/AddData',async(req,res)=>{
    const d = new Date();
    const List=req.body.List;
    try {
        fs.accessSync("datas.json");
      } 
      catch (error) {
        try {
          fs.writeFileSync("datas.json", '[]');
          List.id=d.getFullYear()+"_"+List.dept+"_"+"001"
        } catch (err) {
          console.error(err);
        }
      }
      List.yr=d.getFullYear()
      const totalData = JSON.parse(await fs.promises.readFile("datas.json"));
      if(totalData.length==0){
        List.id=d.getFullYear()+"_"+List.dept+"_"+"001"
      }
      else{
        if((List.id).length==0){
          if(d.getFullYear()!=totalData[totalData.length-1].yr){
            List.id=d.getFullYear()+"_"+List.dept+"001"
          }
          else{
            const prev=(totalData[totalData.length-1].id).split("_")
            const num=Number(prev[2])
            if(num<10){
              List.id=d.getFullYear()+"_"+List.dept+"_00"+(num+1)
            }
            else if(num<100){
              List.id=d.getFullYear()+"_"+List.dept+"_0"+(num+1)
            }
            else{
              List.id=d.getFullYear()+"_"+List.dept+"_"+(num+1)
            }
          }
        }
        
      }
      totalData.push({
        ...List
    });
    await fs.promises.writeFile("datas.json", JSON.stringify(totalData, null, 2));
    res.json({status:List.id})
})
app.post('/Display',async(req,res)=>{
  let flag=1
  let key=""
  try {
    fs.accessSync("datas.json");
  } 
  catch (error) {
    try {
      flag=0
    } catch (err) {
      console.error(err);
    }
  }
  if(flag==1){
    const totalData = JSON.parse(await fs.promises.readFile("datas.json"));
    key = JSON.stringify(totalData)
  }
  else{
    key="fail"
  }
  res.json({status:key})
})
app.post('/Delete', async (req, res) => {
  const id = req.body.id
  let data = "fail";
  try {
    fs.accessSync("datas.json");

    const totalData = JSON.parse(await fs.promises.readFile("datas.json"));
    totalData.forEach((item) => {
      if (item.id == id) {
        data = JSON.stringify(item);
      }
    });
    const changed=totalData.filter((Data)=>{
      return Data.id!=id
    })
    await fs.promises.writeFile("datas.json", JSON.stringify(changed, null, 2));
    console.log(data); 

    res.json({ status: data }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Internal Server Error" });
  }
});
app.post('/Search',async(req,res)=>{
  const id = req.body.id
  let data = "fail";
  try{
    fs.accessSync("datas.json");

    const totalData = JSON.parse(await fs.promises.readFile("datas.json"));
    totalData.forEach((item) => {
      if (item.id == id) {
        data = JSON.stringify(item);
      }
    });
    
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ status: "Internal Server Error" });
  }
  res.json({status:data})
})
app.post('/Filter', async (req, res) => {
  const age = req.body.age;
  const hours = req.body.classes;
  const totalData = JSON.parse(await fs.promises.readFile("datas.json"));
  let data=[]
  let key=""
  totalData.forEach((item) => {
    if (item.age === age && item.hours===hours) {
      data.push(item)
    }
  });
  console.log(data)
  if(data.length==0){
    console.log("failed")
    res.json({status:"fail"})
  }
  else{
    key=JSON.stringify(data)
    console.log(key);
    res.json({status:key})
  }
});
app.post('/Update', async (req, res) => {
  const id=req.body.id
  const totalData = JSON.parse(await fs.promises.readFile("datas.json"));
  let flag=0
    totalData.forEach((item) => {
      if (item.id === id) {
        flag=1
        data = JSON.stringify(item);
        console.log(data)
      }
    });
    if(flag===0){
      JSON.stringify("fail")
    }
    else{
      res.json({status:data})
    }
})
app.post('/Updating', async (req, res) => {
  console.log("updating")
  const List=req.body.List
  const totalData = JSON.parse(await fs.promises.readFile("datas.json"));
    totalData.forEach((item) => {
      if (item.id === List.id) {
        flag=1
        data = JSON.stringify(item);
        console.log(data)
        item.name=List.name
        item.age=List.age
        item.date=List.Date
        item.dept=List.dept
        item.hours=List.hours
      }
    });
    await fs.promises.writeFile("datas.json", JSON.stringify(totalData, null, 2));
    res.json("pass")
  console.log(List.id)
})
app.listen(3500, () => {
    console.log(`Server running on port 3500`);
  })
  
  