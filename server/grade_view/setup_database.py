from grade_view.models import db, Major

def majors_setup(db):
    db.session.query(Major).delete()
    db.session.add(Major('UNDECLARED'))
    import pandas as pd
    majors = pd.read_csv('grade_view/database/data_set/majors-list.csv').sort_values(by=['Major'])['Major'].tolist()
    for i in range(len(majors)):
        db.session.add(Major(majors[i]))
    db.session.commit()

def database_setup(db):
    db.create_all()
    majors_setup(db)