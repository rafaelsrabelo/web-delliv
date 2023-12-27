import { useDispatch, useSelector } from 'react-redux';
import { LayoutApp } from '../../template/App';
import { useEffect, useState } from 'react';
import { fetchOrders } from '../../features/orderSlice';
import { Modal } from '../../components/shared/Modal';

interface OrderProps {
  id: number;
  customer: string;
  address: string;
  user?: { name: string };
  created_at: string;
  status: 'opened' | 'done' | 'canceled' | 'progress';
}

const translateStatus = (status) => {
  const statusMap = {
    opened: 'Aberto',
    done: 'Finalizado',
    canceled: 'Cancelado',
    progress: 'Andamento',
  };
  return statusMap[status] || status;
};

const getStatusColorClass = (status) => {
  const colorMap = {
    opened: 'gray',
    done: 'green',
    canceled: 'red',
    progress: 'blue',
  };

  const color = colorMap[status] || 'gray';
  return `bg-${color}-100`;
};

const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDay = String(day).padStart(2, '0');
  const formattedMonth = String(month).padStart(2, '0');

  return `${formattedDay}/${formattedMonth}/${year}`;
};

export function Orders() {
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [open, setOpen] = useState(false);

  const orderState = useSelector((state) => state.order);

  const dispatch = useDispatch();

  const imageProfile = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png';

  useEffect(() => {
    console.log('Filter Status:', filterStatus);
    dispatch(fetchOrders(filterStatus));
  }, [filterStatus]);

  function handleOrder(order: OrderProps) {
    setSelectedOrderId(order.id);
    console.log('Order ID:', order.id);
    console.log('Customer Name:', order.customer);
  }

  return (
    <LayoutApp>
      <div className="flex items-center">
        <h1 className="text-2xl font-bold mb-4">Delliv - Rastreio Fácil</h1>
        <div className="ml-auto">
          <select
            className="p-0.5 border rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="opened">Aberto</option>
            <option value="done">Finalizado</option>
            <option value="canceled">Cancelado</option>
            <option value="progress">Andamento</option>
          </select>
        </div>
      </div>
      {orderState.loading && <>Loading...</>}
      {!orderState.loading && orderState.error ? <>Error: {orderState.error}</> : null}
      {!orderState.loading && orderState.orders.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-center">
            <thead>
              <tr>
                <th className="p-2 border-b text-xs">Cliente</th>
                <th className="p-2 border-b text-xs">Endereço</th>
                <th className="p-2 border-b text-xs">Entregador</th>
                <th className="p-2 border-b text-xs">Pedido em</th>
                <th className="p-2 border-b text-xs">Status</th>
                <th className="p-2 border-b text-xs">-</th>
              </tr>
            </thead>
            <tbody>
              {orderState.orders.map((order) => (
                <tr key={order.id}>
                  <td className="p-2 border-b text-xs flex items-center">
                    <img src={imageProfile} alt="Nome" className="h-6 w-6 rounded-full me-2" />
                    <p>{order.customer}</p>
                  </td>
                  <td className="p-2 border-b text-xs text-zinc-500 truncate">{order.address}</td>
                  <td className="p-2 border-b text-xs">{order.user?.name || '-'}</td>
                  <td className="p-2 border-b text-xs">{formatDate(order.created_at)}</td>
                  <td className="p-2 border-b text-xs">
                    <span
                      className={`font-medium rounded-full text-xs px-2.5 py-0.5 ${getStatusColorClass(order.status)}`}
                    >
                      {translateStatus(order.status)}
                    </span>
                  </td>
                  <td className="p-2 border-b">
                    <button
                      className="text-xs bg-blue-500 text-white rounded-md px-2 py-1 hover:bg-blue-600"
                      onClick={() => setOpen(true)}
                    >
                      Prosseguir
                    </button>
                    <Modal open={open} onClose={() => setOpen(false)}>
                      <div className="flex flex-col gap-4"></div>
                      <h1 className="text-2xl">Título do Modal</h1>
                      <p>
                        Lore ipsum Lore ipsum Lore ipsum Lore ipsum Lore ipsum Lore ipsum Lore ipsum Lore ipsum Lore
                        ipsum Lore ipsum Lore ipsum
                      </p>
                    </Modal>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>No orders available.</>
      )}
    </LayoutApp>
  );
}
