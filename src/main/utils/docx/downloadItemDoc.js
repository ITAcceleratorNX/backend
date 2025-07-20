import { Document, Packer, Paragraph, TextRun } from "docx";
import { getItemDocumentData } from "../../service/moving/movingOrder.service.js"; // твоя функция
import { Response } from "express";

export const downloadItemDoc = async (req, res = Response) => {
    const itemId = req.params.itemId;
    const data = await getItemDocumentData(itemId);

    if (!data) return res.status(404).send("Item not found");

    // Создание документа
    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        children: [
                            new TextRun(`Документ по товару #${data.item.id}`),
                            new TextRun("\n"),
                            new TextRun(`Наименование: ${data.item.name}`),
                            new TextRun(`\nОбъем: ${data.item.volume}`),
                            new TextRun(`\nМаркировка: ${data.item.cargo_mark}`),
                            new TextRun(`\nСклад: ${data.storageName}`),
                            new TextRun(`\nАдрес склада: ${data.warehouseAddress}`),
                            new TextRun(`\nИмя клиента: ${data.userName}`),
                            new TextRun(`\nТелефон клиента: ${data.userPhone}`),
                            new TextRun(`\nАдрес клиента: ${data.userAddress}`),
                        ],
                    }),
                ],
            },
        ],
    });

    // Генерация и отправка
    const buffer = await Packer.toBuffer(doc);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename=order_item_${itemId}.docx`);
    res.send(buffer);
};
