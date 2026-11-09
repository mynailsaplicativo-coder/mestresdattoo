-- DESAFIO DOS MESTRES — Fase 17: dica de como resolver cada missão
-- Rode no SQL Editor do Supabase. Pode rodar mais de uma vez. Dá para editar as dicas no admin (Missões → Editar).
ALTER TABLE tw_missions ADD COLUMN IF NOT EXISTS hint text;

UPDATE tw_missions m SET hint = v.h FROM (VALUES
  ('tw26-a-backdrop', 'O backdrop do dragão fica no stand da Bronc (veja no Mapa). Tire a foto, poste marcando os parceiros e mande para 5 amigos.'),
  ('tw26-p-backdrop', 'O backdrop do dragão fica no stand da Bronc (veja no Mapa). Tire a foto, poste e mande para 5 amigos.'),
  ('tw26-a-gringo', 'Passe nos stands dos artistas convidados de fora e pergunte de onde a pessoa é. Na observação, escreva o nome e o país.'),
  ('tw26-a-flash', 'Vale sketchbook, papel ou tablet: um desenho rápido já conta. Fotografe o flash pronto.'),
  ('tw26-a-post', 'Poste nos stories ou no feed que está no Desafio dos Mestres, marque @mestresdatattoo e os parceiros e cole o link do post aqui.'),
  ('tw26-a-setup', 'Trabalhando no evento? Fotografe sua bancada montada. Se não, mostre seu kit de trabalho.'),
  ('tw26-a-stencil', 'Baixe o STENCILFLOW pelo botão da missão, escolha uma arte e gere o decalque. Mande o print ou a foto do decalque.'),
  ('tw26-a-entrevista', 'Chegue num artista, peça 30 segundos e pergunte: qual a melhor dica para quem está começando?'),
  ('tw26-a-master', 'Olhe os banners e o telão da entrada da Tattoo Week: o patrocinador Master aparece em destaque.'),
  ('tw26-a-comida', 'Passe na praça de alimentação e registre seu lanche entre uma sessão e outra.'),
  ('tw26-p-comida', 'Vá até a praça de alimentação e registre o seu lanche.'),
  ('tw26-a-dica', 'Grave um vídeo curto (até 30 segundos) com a dica que você queria ter ouvido quando começou.'),
  ('tw26-a-ink', 'Pense no que vem antes de gastar com anúncio. A resposta é uma palavra, e o Ink Authority fala muito dela.'),
  ('tw26-a-tattoo', 'Fotografe uma tattoo que você fez hoje no evento, com boa luz e a pele limpa.'),
  ('tw26-a-estado', 'Converse com os artistas dos stands e pergunte de que cidade eles vieram. Na observação, escreva o nome e o estado.'),
  ('tw26-a-veterano', 'Procure os estúdios mais tradicionais e pergunte há quanto tempo o artista tatua. Peça uma foto com a lenda!'),
  ('tw26-a-trio', 'Junte dois amigos tatuadores (ou faça amizades novas) e tirem uma foto juntos.'),
  ('tw26-a-ceo-foto', 'Vá até o stand da TCM Supply e pergunte pelo CEO. Siga ele no Instagram e tire print antes de enviar.'),
  ('tw26-p-ceo-foto', 'Vá até o stand da TCM Supply e pergunte pelo CEO. Siga ele no Instagram e tire print antes de enviar.'),
  ('tw26-a-selo', 'Os adesivos dourados não aparecem no mapa. Procure em colunas, balcões e cantos dos stands e encoste o celular.'),
  ('tw26-p-selo', 'Os adesivos dourados não aparecem no mapa. Procure em colunas, balcões e cantos dos stands e encoste o celular.'),
  ('tw26-p-checkin', 'Logo na entrada da Tattoo Week, tire uma selfie com o letreiro do evento ao fundo.'),
  ('tw26-p-tattoo', 'Ande pelos stands e pelos concursos e peça para fotografar a tattoo que te parou.'),
  ('tw26-p-amigo', 'Puxe papo com alguém na fila ou nos stands e tirem uma selfie juntos.'),
  ('tw26-p-show', 'Confira no Mapa onde fica o palco e grave um trechinho do show.'),
  ('tw26-p-post', 'Poste nos stories que está no Desafio dos Mestres, marque @mestresdatattoo e mande o print.'),
  ('tw26-p-stencil', 'Baixe o STENCILFLOW pelo botão da missão, escolha uma arte e gere o decalque. Mande o print.'),
  ('p2-01', 'Peça para alguém tirar uma foto sua de corpo inteiro ou faça uma selfie no espelho.'),
  ('p2-05', 'Passe pelos stands e fotografe o flash ou a tattoo que você faria.'),
  ('p3-03', 'Escolha o stand que você mais curtiu e registre com uma foto.'),
  ('p3-05', 'Fotografe a tattoo mais marcante que você viu no evento (peça licença para a pessoa).')
) AS v(id, h) WHERE m.id = v.id;
