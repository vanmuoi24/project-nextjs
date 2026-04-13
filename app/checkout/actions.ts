'use server';

/**
 * Server Action xử lý đặt hàng
 * @param orderData Dữ liệu đơn hàng từ Client gửi lên
 */
export async function createOrderAction(orderData: {
	userId?: number;
	customerInfo: {
		name: string;
		email: string;
		phone: string;
		address: string;
		city: string;
		district: string;
	};
	items: any[];
	totalPrice: number;
	shipping: number;
	total: number;
	paymentMethod: string;
}) {
	console.log('--- Đang xử lý đơn hàng tại Server ---');
	console.log('Khách hàng:', orderData.customerInfo.name);
	console.log('Tổng tiền:', orderData.total);
	// Giả lập độ trễ mạng/xử lý DB
	await new Promise((resolve) => setTimeout(resolve, 1500));
	// Logic kiểm tra
	if (!orderData.items || orderData.items.length === 0) {
		return { success: false, message: 'Giỏ hàng của bạn đang trống.' };
	}
	if (!orderData.customerInfo.phone) {
		return { success: false, message: 'Số điện thoại là bắt buộc.' };
	}
	const finalOrder = {
		...orderData,
		id: `ORD-${Date.now()}`,
		status: 'pending',
		createdAt: new Date().toISOString(),
	};

	console.log('--- Đơn hàng đã được tạo thành công tại Server ---');

	return {
		success: true,
		order: finalOrder,
	};
}
	