import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const JAULAS_NAME = "BHP_ACTIVOS_JAULAS"
const CAJAS_NAME = "BHP_ACTIVOS_CAJAS"
const POLEAS_NAME = "BHP_ACTIVOS_POLEAS"

const TITLES = {
    [JAULAS_NAME]: "Jaulas",
    [CAJAS_NAME]: "Cajas",
    [POLEAS_NAME]: "Poleas",
    'Otros': "Otros"
}

export function TableComponent({ data }) {
    const groupDataByCategoryName = (data) => {
        const groupedData = {
            [JAULAS_NAME]: [],
            // [CAJAS_NAME]: [],
            // [POLEAS_NAME]: [],
            // 'Otros': []
        }
        data.forEach(item => {
            groupedData[JAULAS_NAME] = [...groupedData[JAULAS_NAME], item]
            // if (item.deviceGroup === JAULAS_NAME) {
            //     groupedData[JAULAS_NAME] = [...groupedData[JAULAS_NAME], item]
            // } else if (item.deviceGroup === CAJAS_NAME) {
            //     groupedData[CAJAS_NAME] = [...groupedData[CAJAS_NAME], item]
            // } else if (item.deviceGroup === POLEAS_NAME) {
            //     groupedData[POLEAS_NAME] = [...groupedData[POLEAS_NAME], item]
            // } else {
            //     groupedData['Otros'] = [...groupedData['Otros'], item]
            // }
        })
        return groupedData
    }

    const groupedData = groupDataByCategoryName(data)

    if (data.length === 0) {
        return (
            <div className="flex justify-center items-center h-full min-h-[200px]">
                <p className="text-muted-foreground">No hay datos para mostrar</p>
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-primaryColor hover:bg-hoverColor">
                    <TableHead className="w-[100px] text-white font-bold">Nombre</TableHead>
                    <TableHead className="text-right text-white font-bold">Stock</TableHead>
                </TableRow>
            </TableHeader >
            <TableBody>
                {Object.keys(groupedData).map((item, index) => (
                    <TableRow key={`${item}-${index}`}>
                        <TableCell>{TITLES[item]}</TableCell>
                        <TableCell className="text-right">{groupedData[item].length}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow className="bg-[#ECF3FA] border-t border-[#ECF3FA]">
                    <TableCell colSpan={1} className="text-black font-bold">Total</TableCell>
                    <TableCell className="text-right text-black font-bold">{Object.values(groupedData).reduce((acc, item) => acc + item.length, 0)}</TableCell>
                </TableRow>
            </TableFooter>
        </Table >
    )
}
