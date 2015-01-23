package java.lang;

import gnu.testlet.Testlet;
import gnu.testlet.TestHarness;

class Monkey {
    private String name;

    public Monkey(String name) {
        this.name = name;
    }
    public void fight() {
        for (int i = 1; i <= 10; i++) {
            System.out.println(name + ":kill enemy " + i);
            Thread.yield();
            try {
                Thread.sleep(100);
            } catch (Exception e) {
            }
        }
    }
}

public class TestThreadYield implements Testlet {
    private boolean result = false;

    class RuntimeExceptionThread extends Thread {
        public void run() {
             throw new RuntimeException("runtime exception");
        }
    }

    public void test(TestHarness th) {
        Monkey m1 = new Monkey("Ben");
        Monkey m2 = new Monkey("Yuan");
        Monkey m3 = new Monkey("Quan");
        m1.fight();
        m2.fight();
        m3.fight();
    }
}

