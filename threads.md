# Process
Process is a instance of running program. It is a container for a set of resources used when executing the instance of a 
program. A process has a self-contained execution environment. A process generally has a complete, private set of basic 
run-time resources; in particular, each process has its own memory space.

# Thread
Thread is a smallest unit of processing that can be performed in an OS. A thread is a path of execution within a process.
A process can have multiple threads. A thread is also known as lightweight process. Threads are used to achieve 
parallelism. A thread shares the process resources. Multiple threads can exist within the same process and share
resources such as memory, while different processes do not share these resources. 

## Difference
1. A process is a program in execution, whereas a thread is a separate path of execution in a program.
2. A process has its own memory space, whereas a thread shares the memory of the process to which it belongs.
3. A process has a self-contained execution environment, whereas a thread shares an execution environment with other 
   threads running in the same process.
4. A process has a complete, private set of basic run-time resources, whereas a thread shares the resources of the
   process to which it belongs.

## Example
A web browser is a process. Each tab in the browser is a separate thread. If a tab crashes, the browser continues to
function. If the browser crashes, all tabs are closed.


# Deadlock
Deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for
another resource acquired by some other process. 

## How Deadlock can arise
Deadlock can arise if four conditions hold simultaneously:
### Mutual Exclusion
At least one resource must be held in a non-shareable mode.
### Hold and Wait
A process must be holding at least one resource and waiting for resources held by other processes.
### No Preemption
Resources cannot be preempted; they must be released by the process holding them.
### Circular Wait
A set of processes must exist such that each process is waiting for a resource held by the next process in the set.

## Handling Deadlock
There are four ways to handle deadlock:
### Deadlock Prevention
Ensuring that at least one of the necessary conditions for deadlock cannot hold.
### Deadlock Avoidance
Ensuring that the system will never enter a deadlock state.
### Deadlock Detection
Allowing the system to enter a deadlock state and then recover.
### Deadlock Ignorance
Allowing the system to enter a deadlock state and remain in the deadlock state.


# Scheduler
Scheduler is a program that decides which process to run next. It is a part of the operating system that decides which
process runs at a certain point in time. It is responsible for the efficient use of the processor and for balancing the
workload of the processor.

## Types of Schedulers
There are four types of schedulers:
### Long-Term Scheduler
It is also known as a job scheduler. It selects processes from the queue and loads them into memory for execution.
### Short-Term Scheduler
It is also known as a CPU scheduler. It selects a process from the ready queue and allocates the CPU to that process.
### Medium-Term Scheduler
It removes processes from memory and places them on the disk, swapping them back in later.
### Real-Time Scheduler
It is used in real-time systems. It selects processes based on their priority and deadline.

