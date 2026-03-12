import { useState, useMemo, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Plus, Search, Edit2, Trash2 } from "lucide-react"

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow
} from "@/components/ui/table"

import {
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { formatCurrency, formatNumber } from "@/lib/utils"

type AuxProductCategory = "lubricant" | "car_care" | "additive"

type AuxProduct = {
id:number
name:string
description?:string
category:AuxProductCategory
importPrice:number
sellPrice:number
stock:number
unit:string
isActive:boolean
}

const categoryLabels:Record<AuxProductCategory,string>={
lubricant:"Dầu nhờn – Mỡ bôi trơn",
car_care:"Nước & dung dịch chăm sóc xe",
additive:"Phụ gia & hoá chất"
}

const categoryFromParam:Record<string,AuxProductCategory>={
lubricant:"lubricant",
"car-care":"car_care",
additive:"additive"
}

export default function Accessories(){

const {category:categoryParam}=useParams<{category?:string}>()

const urlCategory=categoryParam?categoryFromParam[categoryParam]:undefined

const [products,setProducts]=useState<AuxProduct[]>([])
const [search,setSearch]=useState("")

const [dialogOpen,setDialogOpen]=useState(false)
const [editingProduct,setEditingProduct]=useState<AuxProduct|null>(null)

const [form,setForm]=useState({
name:"",
category:"lubricant" as AuxProductCategory,
unit:"chai",
importPrice:"",
sellPrice:"",
stock:"",
description:""
})

/* LOAD DATA */

async function loadProducts(){

let url="/api/accessories"

if(urlCategory){

const map={
lubricant:"LUBRICANT",
car_care:"CAR_CARE",
additive:"ADDITIVE"
}

url+=`?category=${map[urlCategory]}`
}

const data=await apiGet<AuxProduct[]>(url)

setProducts(data)
}

useEffect(()=>{
loadProducts()
},[urlCategory])

/* FILTER */

const filtered=useMemo(()=>{
return products.filter(p=>
p.name.toLowerCase().includes(search.toLowerCase())
)
},[products,search])

/* STATS */

const stats=useMemo(()=>{

const totalProducts=products.length

const totalValue=products.reduce(
(s,p)=>s+p.sellPrice*p.stock,0
)

const lowStock=products.filter(p=>p.stock<5).length

const activeProducts=products.filter(p=>p.isActive).length

return{totalProducts,totalValue,lowStock,activeProducts}

},[products])

/* OPEN ADD */

function handleOpenAdd(){

setEditingProduct(null)

setForm({
name:"",
category:urlCategory||"lubricant",
unit:"chai",
importPrice:"",
sellPrice:"",
stock:"",
description:""
})

setDialogOpen(true)
}

/* OPEN EDIT */

function handleOpenEdit(product:AuxProduct){

setEditingProduct(product)

setForm({
name:product.name,
category:product.category,
unit:product.unit,
importPrice:product.importPrice,
sellPrice:product.sellPrice,
stock:product.stock,
description:product.description||""
})

setDialogOpen(true)
}

/* SAVE */

async function handleSave(){

if(!form.name.trim())return

if(editingProduct){

await apiPut(`/api/accessories/${editingProduct.id}`,form)

}else{

await apiPost("/api/accessories",{
...form,
category:form.category.toUpperCase()
})

}

setDialogOpen(false)

loadProducts()
}

/* DELETE */

async function handleDelete(id:number){

if(!confirm("Xóa sản phẩm này?"))return

await apiDelete(`/api/accessories/${id}`)

loadProducts()
}

return(

<div className="space-y-6">

{/* HEADER */}

<div className="flex items-center justify-between">

<div>

<h1 className="text-2xl font-bold">

{urlCategory?categoryLabels[urlCategory]:"Hàng phụ trợ"}

</h1>

<p className="text-sm text-muted-foreground">
Quản lý sản phẩm phụ trợ
</p>

</div>

<Button onClick={handleOpenAdd}>
<Plus className="mr-2 h-4 w-4"/>
Thêm sản phẩm
</Button>

</div>

{/* STATS */}

<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

{[
{label:"Tổng sản phẩm",value:stats.totalProducts},
{label:"Đang kinh doanh",value:stats.activeProducts},
{label:"Giá trị tồn kho",value:formatCurrency(stats.totalValue)},
{label:"Sắp hết hàng",value:stats.lowStock}
].map((s,i)=>(

<motion.div key={i}
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
transition={{delay:i*0.05}}>

<Card>

<CardContent className="p-4">

<p className="text-xs text-muted-foreground">{s.label}</p>

<p className="text-lg font-bold">{s.value}</p>

</CardContent>

</Card>

</motion.div>

))}

</div>

{/* TABLE */}

<Card>

<CardHeader>

<div className="flex items-center justify-between">

<CardTitle>Danh sách sản phẩm</CardTitle>

<div className="relative">

<Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground"/>

<Input
className="pl-8 w-[200px]"
placeholder="Tìm sản phẩm..."
value={search}
onChange={e=>setSearch(e.target.value)}
/>

</div>

</div>

</CardHeader>

<CardContent>

<div className="rounded-md border">

<Table>

<TableHeader>

<TableRow>

<TableHead>Tên</TableHead>
<TableHead>Danh mục</TableHead>
<TableHead className="text-right">Giá nhập</TableHead>
<TableHead className="text-right">Giá bán</TableHead>
<TableHead className="text-center">Tồn kho</TableHead>
<TableHead className="text-right">Thao tác</TableHead>

</TableRow>

</TableHeader>

<TableBody>

{filtered.map(p=>(

<TableRow key={p.id}>

<TableCell>{p.name}</TableCell>

<TableCell>

<Badge variant="outline">
{categoryLabels[p.category]}
</Badge>

</TableCell>

<TableCell className="text-right">
{formatCurrency(p.importPrice)}
</TableCell>

<TableCell className="text-right">
{formatCurrency(p.sellPrice)}
</TableCell>

<TableCell className="text-center">
{formatNumber(p.stock)} {p.unit}
</TableCell>

<TableCell className="text-right">

<div className="flex justify-end gap-1">

<Button
size="icon"
variant="ghost"
onClick={()=>handleOpenEdit(p)}
>
<Edit2 className="h-4 w-4"/>
</Button>

<Button
size="icon"
variant="ghost"
onClick={()=>handleDelete(p.id)}
>
<Trash2 className="h-4 w-4"/>
</Button>

</div>

</TableCell>

</TableRow>

))}

</TableBody>

</Table>

</div>

</CardContent>

</Card>

{/* DIALOG FORM */}

<Dialog open={dialogOpen} onOpenChange={(open)=>{
if(!open)setForm({name:"",category:"lubricant",unit:"chai",importPrice:"",sellPrice:"",stock:"",description:""})
setDialogOpen(open)
}}>

<DialogContent>

<DialogHeader>

<DialogTitle>
{editingProduct?"Sửa sản phẩm":"Thêm sản phẩm"}
</DialogTitle>

<DialogDescription>
Cập nhật thông tin sản phẩm phụ trợ
</DialogDescription>

</DialogHeader>

<div className="space-y-4">

<div>

<Label>Tên sản phẩm</Label>

<Input
placeholder="Nhập tên sản phẩm"
value={form.name}
onChange={e=>setForm({...form,name:e.target.value})}
/>

</div>

<div className="grid grid-cols-2 gap-4">

<div>

<Label>Giá nhập</Label>

<Input
type="number"
placeholder="Nhập giá nhập"
value={form.importPrice}
onChange={e=>{
const val=e.target.value
if(val===""||Number(val)>=0)setForm({...form,importPrice:val})
}}
min="0"
/>

</div>

<div>

<Label>Giá bán</Label>

<Input
type="number"
placeholder="Nhập giá bán"
value={form.sellPrice}
onChange={e=>{
const val=e.target.value
if(val===""||Number(val)>=0)setForm({...form,sellPrice:val})
}}
min="0"
/>

</div>

</div>

<div className="grid grid-cols-2 gap-4">

<div>

<Label>Tồn kho</Label>

<Input
type="number"
placeholder="Nhập số lượng"
value={form.stock}
onChange={e=>{
const val=e.target.value
if(val===""||Number(val)>=0)setForm({...form,stock:val})
}}
min="0"
/>

</div>

<div>

<Label>Đơn vị</Label>

<Input
placeholder="Vd: chai, lít, kg"
value={form.unit}
onChange={e=>setForm({...form,unit:e.target.value})}
/>

</div>

</div>

<div>

<Label>Mô tả</Label>

<Textarea
placeholder="Mô tả chi tiết sản phẩm..."
value={form.description}
onChange={e=>setForm({...form,description:e.target.value})}
/>

</div>

</div>

<DialogFooter>

<Button variant="outline" onClick={()=>setDialogOpen(false)}>
Hủy
</Button>

<Button onClick={handleSave}>
{editingProduct?"Cập nhật":"Thêm"}
</Button>

</DialogFooter>

</DialogContent>

</Dialog>

</div>
)
}