/**
 * Tipos de domínio do Vitrine Local.
 * A camada de dados (src/data) implementa estes contratos com mocks e pode ser
 * substituída por Lovable Cloud sem alterar a interface.
 */

export type City = {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  /** Cidade atendida pela operação */
  served: boolean;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  emoji: string;
};

export type Merchant = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  categoryName: string;
  cityId: string;
  cover: string;
  logoEmoji: string;
  rating: number;
  reviews: number;
  etaMin: number;
  etaMax: number;
  deliveryFee: number;
  minOrder: number;
  distanceKm: number;
  isOpen: boolean;
  discountLabel?: string;
  description: string;
  tags: string[];
};

export type ProductOptionChoice = {
  id: string;
  name: string;
  priceDelta: number;
};

export type ProductOptionGroup = {
  id: string;
  name: string;
  /** "single" = escolha obrigatória, "multi" = adicionais */
  type: "single" | "multi";
  required: boolean;
  choices: ProductOptionChoice[];
};

export type Product = {
  id: string;
  merchantId: string;
  menuSection: string;
  name: string;
  description: string;
  price: number;
  image: string;
  popular?: boolean;
  optionGroups: ProductOptionGroup[];
};

export type CartItemOption = {
  groupId: string;
  groupName: string;
  choiceId: string;
  choiceName: string;
  priceDelta: number;
};

export type CartItem = {
  id: string;
  productId: string;
  merchantId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  options: CartItemOption[];
  note?: string;
};

export type OrderStatusStep =
  | "confirmed"
  | "preparing"
  | "dispatched"
  | "arriving"
  | "delivered";

export type OrderState = "andamento" | "concluido" | "cancelado";

export type Order = {
  id: string;
  code: string;
  merchantId: string;
  merchantName: string;
  merchantCover: string;
  createdAt: string;
  total: number;
  state: OrderState;
  status: OrderStatusStep;
  items: { name: string; quantity: number }[];
  courier?: { name: string; vehicle: string; rating: number };
};

export type PaymentMethodKind = "pix" | "card" | "cash";

export type PaymentMethod = {
  id: string;
  kind: PaymentMethodKind;
  label: string;
  description: string;
};

export type Address = {
  id: string;
  label: string;
  street: string;
  number: string;
  complement?: string;
  reference?: string;
  district: string;
  cityId: string;
};

export type SearchFilter =
  | "proximos"
  | "avaliados"
  | "rapidos"
  | "taxa"
  | "ofertas";
