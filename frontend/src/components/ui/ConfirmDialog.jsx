import { Modal } from './Modal'
import { Button } from './Button'

export function ConfirmDialog({ aberto, onFechar, onConfirmar, titulo, descricao, confirmando }) {
    return (
        <Modal aberto={aberto} onFechar={onFechar} title={titulo}>
            <p className="text-sm text-slate-600">{descricao}</p>
            <div className="mt-6 flex justify-end gap-2">
                <Button variant="secondary" onClick={onFechar} disabled={confirmando}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={onConfirmar} disabled={confirmando}>
                    {confirmando ? 'Processando...' : 'Confirmar'}
                </Button>
            </div>
        </Modal>
    )
}