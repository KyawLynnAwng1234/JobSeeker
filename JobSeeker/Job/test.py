from Job.models import Jobs

def fun():
    jobs=Jobs.objects.values()
    print(jobs)