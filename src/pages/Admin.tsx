import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Product } from "@/types/Product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProducts } from "@/contexts/ProductContext";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";

const productSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    price: z.number().min(0, 'Preço deve ser positivo'),
    originalPrice: z.number().optional(),
    image: z.string().url('URL da imagem deve ser válida'),
    category: z.string().min(1, 'Categoria é obrigatória'),
    rating: z.number().min(0).max(5),
    description: z.string().min(1, 'Descrição é obrigatória'),
    stockQuantity: z.number().min(0, 'Quantidade deve ser positiva'),
    inStock: z.boolean()
});

type ProductFormData = z.infer<typeof productSchema>;

// Componente para Input com máscara de valor monetário
const CurrencyInput = React.forwardRef<
    HTMLImageElement,
    {
        value?: number;
        onChange?: (value: number) => void;
        placeholder?: string;
        id?: string;
        className?: string;
    }
>(({ value, onChange, placeholder, id, className }, ref) => {
    const [displayValue, setDisplayValue] = useState(value || '');

    const formatCurrency = (value: string) => {
        // Remove tudo que não é dígito
        const numbers = value.replace(/\D/g, '');

        if (!numbers) return '';

        // Converte para número e divide por 100 para considerar os centavos
        const number = parseInt(numbers) / 100;

        // Formata para moeda brasileira
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        }).format(number)
    };

    const parseCurrency = (formattedValue: string): number => {
        // Remove tudo que não é dígito
        const numbers = formattedValue.replace(/\D/g, '');

        if (!numbers) return 0;

        // Converte para número e divide por 100
        return parseInt(numbers) / 100;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const formatted = formatCurrency(inputValue);

        setDisplayValue(formatted);

        if (onChange) {
            const numericValue = parseCurrency(formatted);
            onChange(numericValue);
        }
    };

    React.useEffect(() => {
        if (typeof value === 'number' && value > 0) {
            const formatted = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2
            }).format(value);
            setDisplayValue(formatted);
        } else if (!value || value === 0) {
            setDisplayValue('');
        }
    }, [value]);

    return (
        <Input
            id={id}
            value={displayValue}
            onChange={handleInputChange}
            placeholder={placeholder || "R$ 0,00"}
            className={className}
        />
    );
});

CurrencyInput.displayName = "CurrencyInput";

const Admin = () => {
    const { products, addProduct, deleteProduct, loading } = useProducts();
    const [showAddForm, setShowAddForm] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        control,
        formState: { errors }
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            rating: 5,
            inStock: true,
            stockQuantity: 0,
            price: 0,
            originalPrice: 0
        }
    });

    const onSubmit = async (data: ProductFormData) => {
        try {
            const productData: Omit<Product, 'id'> = {
                name: data.name,
                price: data.price,
                originalPrice: data.originalPrice,
                image: data.image,
                category: data.category,
                rating: data.rating,
                inStock: data.inStock,
                description: data.description,
                stockQuantity: data.stockQuantity
            };
            await addProduct(productData);
            reset();
            setShowAddForm(false);
        } catch (error) {
            // Erro já é tratado no contexto
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm('Tem certeza que deseja deletar este produto?')) {
            try {
                await deleteProduct(id);
            } catch (error) {
                // Erro já é tratado no contexto
            }
        }
    };

    const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Beauty'];

    const formatCurrencyDisplay = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 p-6">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Painel Administrativo</h1>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Produto
                        </Button>
                    </div>
                </div>

                {showAddForm && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Adicionar Novo Produto</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Nome do Produto</Label>
                                        <Input
                                            {...register('name')}
                                            id="name"
                                            placeholder="Digite o nome do produto"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="category">Categoria</Label>
                                        <Select onValueChange={(value) => setValue('category', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione uma categoria" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category && (
                                            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="price">Preço (R$)</Label>
                                        <Controller
                                            name="price"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <CurrencyInput
                                                    id="price"
                                                    value={value}
                                                    onChange={onChange}
                                                    placeholder="R$ 0,00"
                                                />
                                            )}
                                        />
                                        {errors.price && (
                                            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="originalPrice">Preço Original (R$) - Opcional</Label>
                                        <Controller
                                            name="originalPrice"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <CurrencyInput
                                                    id="originalPrice"
                                                    value={value}
                                                    onChange={onChange}
                                                    placeholder="R$ 0,00"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="stockQuantity">Quantidade em Estoque</Label>
                                        <Input
                                            {...register('stockQuantity', { valueAsNumber: true })}
                                            id="stockQuantity"
                                            type="number"
                                            placeholder="0"
                                        />
                                        {errors.stockQuantity && (
                                            <p className="text-red-500 text-sm mt-1">{errors.stockQuantity.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="rating">Avaliação (0-5)</Label>
                                        <Input
                                            {...register('rating', { valueAsNumber: true })}
                                            id="rating"
                                            type="number"
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            placeholder="5.0"
                                        />
                                        {errors.rating && (
                                            <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="image">URL da Imagem</Label>
                                    <Input
                                        {...register('image')}
                                        id="image"
                                        placeholder="https://exemplo.com/imagem.jpg"
                                    />
                                    {errors.image && (
                                        <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="description">Descrição</Label>
                                    <Textarea
                                        {...register('description')}
                                        id="description"
                                        placeholder="Descrição detalhada do produto"
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="inStock"
                                        checked={watch('inStock')}
                                        onCheckedChange={(checked) => setValue('inStock', checked)}
                                    />
                                    <Label htmlFor="inStock">Produto em estoque</Label>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700"
                                        disabled={loading}
                                    >
                                        {loading ? 'Adicionando...' : 'Adicionar Produto'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowAddForm(false)}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Produtos Cadastrados ({products.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Categoria</TableHead>
                                        <TableHead>Preço</TableHead>
                                        <TableHead>Estoque</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Avaliação</TableHead>
                                        <TableHead>Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>{product.category}</TableCell>
                                            <TableCell>{formatCurrencyDisplay(product.price)}</TableCell>
                                            <TableCell>{product.stockQuantity}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${product.inStock
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {product.inStock ? 'Em Estoque' : 'Esgotado'}
                                                </span>
                                            </TableCell>
                                            <TableCell>{product.rating}/5</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size={`sm`}
                                                        variant={`outline`}
                                                        onClick={() => handleDelete(product.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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
            </div>
        </div>
    );
};

export default Admin;