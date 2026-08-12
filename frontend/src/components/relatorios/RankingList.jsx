import { Card, CardHeader, CardContent } from '../ui/Card'

export function RankingList({ title, itens, campoContagem, labelContagem }) {
    return (
        <Card>
            <CardHeader>
                <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {itens.length === 0 && <p className="text-sm text-slate-500">Sem dados suficientes ainda.</p>}
                {itens.map((item, indice) => (
                    <div key={item.equipamento.id} className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                            {indice + 1}
                        </span>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">{item.equipamento.numeroPatrimonio}</p>
                            <p className="text-xs text-slate-500">{item.equipamento.marca} {item.equipamento.modelo}</p>
                        </div>
                        <span className="text-sm font-semibold text-slate-700">
                            {item[campoContagem]} {labelContagem}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}