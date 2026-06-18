-- Datos de ejemplo para desarrollo (opcional). Ejecutar después de schema.sql.
insert into public.services (name, slug, description, duration_min, price_clp, icon) values
  ('Kinesiología Traumatológica','traumatologica','Rehabilitación de lesiones musculoesqueléticas.',45,28000,'Bone'),
  ('Kinesiología Deportiva','deportiva','Prevención y recuperación de lesiones deportivas.',45,30000,'Activity'),
  ('Kinesiología Respiratoria','respiratoria','Tratamiento de patologías respiratorias.',40,26000,'Wind'),
  ('Rehabilitación Neurológica','neurologica','Recuperación funcional neurológica.',60,35000,'Brain'),
  ('Evaluación Postural','postural','Análisis biomecánico y plan correctivo.',40,25000,'PersonStanding'),
  ('Terapia Manual','terapia-manual','Técnicas manuales para aliviar dolor.',45,29000,'Hand');

insert into public.professionals (full_name, title, specialties, bio) values
  ('Dra. Carla Méndez','Kinesióloga, Mg. en Rehabilitación','{Traumatológica,Terapia Manual}','12 años de experiencia.'),
  ('Klgo. Diego Soto','Kinesiólogo Deportivo','{Deportiva,Terapia Manual}','Especialista en retorno deportivo.'),
  ('Klga. Antonia Rivas','Kinesióloga Respiratoria','{Respiratoria}','Rehabilitación cardiorrespiratoria.'),
  ('Klgo. Felipe Araya','Kinesiólogo, Mg. en Neurorrehabilitación','{Neurológica,Postural}','Recuperación funcional neurológica.');
