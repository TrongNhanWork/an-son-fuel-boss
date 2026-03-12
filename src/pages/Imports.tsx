import { useEffect, useState } from "react"
import { apiGet, apiPost } from "@/lib/api"
import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

type ImportDto = {
  id: number
  tankCode: string
  fuelTypeName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  supplierName: string
  createdAt: string
}

type Tank = {
  id: number
  name: string
  fuel?: {
    name: string
  }
}

type Supplier = {
  id: number
  name: string
}

export default function Imports() {

  const [imports, setImports] = useState<ImportDto[]>([])
  const [tanks, setTanks] = useState<Tank[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [tankId, setTankId] = useState<number>()
  const [supplierId, setSupplierId] = useState<number>()

  const [quantity, setQuantity] = useState("")
  const [unitPrice, setUnitPrice] = useState("")

  const total = Number(quantity || 0) * Number(unitPrice || 0)

  useEffect(() => {
    loadImports()
    loadTanks()
    loadSuppliers()
  }, [])

  const loadImports = async () => {
    const data: ImportDto[] = await apiGet("/api/imports")
    setImports(data)
  }

  const loadTanks = async () => {
    const data: Tank[] = await apiGet("/api/tanks")
    setTanks(data)

    if (data.length > 0) {
      setTankId(data[0].id)
    }
  }

  const loadSuppliers = async () => {
    const data: Supplier[] = await apiGet("/api/suppliers")
    setSuppliers(data)

    if (data.length > 0) {
      setSupplierId(data[0].id)
    }
  }

  const handleSubmit = async () => {

    if (!tankId || !supplierId) {
      alert("Thiếu thông tin")
      return
    }

    try {

      const body = {
        tankId: tankId,
        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
        supplierId: supplierId
      }

      await apiPost("/api/imports", body)

      alert("Nhập kho thành công")

      setIsDialogOpen(false)

      setQuantity("")
      setUnitPrice("")

      loadImports()

    } catch (err: any) {
      alert(err.message)
    }

  }

  return (
    <div className="p-6 space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý nhập kho</h1>

        <Button onClick={() => setIsDialogOpen(true)}>
          + Tạo phiếu nhập kho
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>

        <DialogContent className="sm:max-w-[500px]">

          <DialogHeader>
            <DialogTitle>Tạo phiếu nhập kho</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <div>
              <label className="text-sm">Bể chứa</label>

              <select
                value={tankId}
                onChange={(e) => setTankId(Number(e.target.value))}
                className="w-full border rounded p-2"
              >
                {tanks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} - {t.fuel?.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm">Số lượng (lít)</label>

              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="text-sm">Đơn giá (VNĐ/lít)</label>

              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="text-sm">Nhà cung cấp</label>

              <select
                value={supplierId}
                onChange={(e) => setSupplierId(Number(e.target.value))}
                className="w-full border rounded p-2"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-100 p-3 rounded flex justify-between">
              <span>Tổng giá trị</span>

              <span className="font-bold text-blue-600">
                {total > 0 ? total.toLocaleString() : "-"} đ
              </span>
            </div>

          </div>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Hủy
            </Button>

            <Button onClick={handleSubmit}>
              Xác nhận nhập kho
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

      <div className="rounded-xl border bg-card shadow-card">

        <Table>

          <TableHeader>
            <TableRow>

              <TableHead>Thời gian</TableHead>
              <TableHead>Bể</TableHead>
              <TableHead>Nhiên liệu</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Đơn giá</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Nhà cung cấp</TableHead>

            </TableRow>
          </TableHeader>

          <TableBody>

            {imports.map((i) => (

              <TableRow key={i.id}>

                <TableCell>
                  {new Date(i.createdAt).toLocaleString()}
                </TableCell>

                <TableCell>
                  {i.tankCode}
                </TableCell>

                <TableCell>
                  {i.fuelTypeName}
                </TableCell>

                <TableCell>
                  {i.quantity} lít
                </TableCell>

                <TableCell>
                  {i.unitPrice.toLocaleString()} đ
                </TableCell>

                <TableCell className="font-semibold">
                  {i.totalPrice.toLocaleString()} đ
                </TableCell>

                <TableCell>
                  {i.supplierName}
                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </div>

    </div>
  )
}

